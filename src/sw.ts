/// <reference lib="webworker" />
/**
 * 서비스워커 (vite-plugin-pwa injectManifest).
 * - 앱 셸 프리캐시 + SPA 내비게이션 폴백 + 이미지 런타임 캐시
 * - 웹 푸시 수신(push) / 알림 클릭(notificationclick)
 */
import { clientsClaim } from 'workbox-core';
import { CacheExpiration, ExpirationPlugin } from 'workbox-expiration';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
  type PrecacheEntry,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

import { notificationDestination } from '@/utils/notificationDestination';

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<PrecacheEntry | string>;
};

// registerType: 'autoUpdate' — 새 버전이 오면 바로 교체
self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// SPA 라우팅: 모든 내비게이션을 index.html 로 (개발 프록시 /api 제외)
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [/^\/api\//],
  }),
);

/* ---------------- 서명된(presigned) 사진 ---------------- */

// 서버는 응답마다 새로 서명해서 같은 사진도 주소(쿼리스트링)가 매번 다르다.
// 서명을 뺀 경로를 키로 저장해 한 번 받은 사진은 다시 내려받지 않는다.
// 객체 경로는 업로드마다 새로 만들어지므로 경로가 같으면 같은 사진이다.
const SIGNED_IMAGE_CACHE = 'signed-images';
const signedImageExpiration = new CacheExpiration(SIGNED_IMAGE_CACHE, {
  maxEntries: 300,
  maxAgeSeconds: 30 * 24 * 60 * 60,
});

const isSignedUrl = (url: URL) => url.searchParams.has('X-Amz-Signature');

// 버킷 CORS 가 GET 을 막으면 한 번 확인한 뒤로는 cors 시도를 건너뛴다 (요청 두 번 방지)
let corsBlocked = false;

registerRoute(
  ({ request, url }) => request.destination === 'image' && isSignedUrl(url),
  async ({ request, url }) => {
    const key = `${url.origin}${url.pathname}`;
    const cache = await caches.open(SIGNED_IMAGE_CACHE);
    const cached = await cache.match(key);
    if (cached) {
      void signedImageExpiration.updateTimestamp(key);
      return cached;
    }

    if (corsBlocked) return fetch(request);

    try {
      // cors 로 받아야 상태 코드를 확인할 수 있다 (만료 403 을 캐시하지 않도록)
      const response = await fetch(url.href, {
        mode: 'cors',
        credentials: 'omit',
      });
      if (response.ok) {
        await cache.put(key, response.clone());
        await signedImageExpiration.updateTimestamp(key);
        void signedImageExpiration.expireEntries();
      }
      return response;
    } catch {
      // 버킷 CORS 가 GET 을 막는 경우: 캐시 없이 원래 요청대로 받는다
      corsBlocked = true;
      return fetch(request);
    }
  },
);

// 그 외 이미지는 처음 볼 때 저장하고, 다음부터 캐시를 먼저 보여준 뒤 갱신
// <img> 요청만 다룬다. fetch() 요청에 <img> 로 저장한 opaque 응답을 돌려주면 오류가 난다.
registerRoute(
  ({ request, url }) => request.destination === 'image' && !isSignedUrl(url),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 100 })],
  }),
);

/* ---------------- 웹 푸시 ---------------- */

/** 서버 푸시 페이로드 (momento-server 와 맞춘 스펙) */
interface PushPayload {
  notificationId?: number;
  type?: string;
  referenceId?: number | null;
  title?: string;
  body?: string | null;
}

/** 앱 창에 라우터 이동을 요청하는 메시지 (src/hooks/usePushBridge.ts 와 맞춘다) */
const PUSH_NAVIGATE_MESSAGE = 'PUSH_NAVIGATE';

function readPayload(event: PushEvent): PushPayload {
  try {
    return (event.data?.json() as PushPayload) ?? {};
  } catch {
    return { body: event.data?.text() ?? null };
  }
}

self.addEventListener('push', (event) => {
  const payload = readPayload(event);
  const path =
    (payload.type &&
      notificationDestination({
        type: payload.type,
        referenceId: payload.referenceId ?? null,
      })) ||
    '/notifications';

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Momento', {
      body: payload.body ?? undefined,
      icon: '/icons/192.png',
      // 같은 알림이 중복 도착하면 하나로 합친다
      tag: payload.notificationId
        ? `notification-${payload.notificationId}`
        : undefined,
      data: { path },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const path =
    (event.notification.data as { path?: string } | null)?.path ||
    '/notifications';

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      const client = windows.find((item) =>
        item.url.startsWith(self.location.origin),
      );
      if (client) {
        // 열려 있는 앱이 있으면 새로고침 없이 그 안에서 이동
        await client.focus();
        client.postMessage({ type: PUSH_NAVIGATE_MESSAGE, path });
        return;
      }
      await self.clients.openWindow(path);
    })(),
  );
});
