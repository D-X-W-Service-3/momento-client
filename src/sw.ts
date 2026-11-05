/// <reference lib="webworker" />
/**
 * 서비스워커 (vite-plugin-pwa injectManifest).
 * - 앱 셸 프리캐시 + SPA 내비게이션 폴백 + 이미지 런타임 캐시
 * - 웹 푸시 수신(push) / 알림 클릭(notificationclick)
 */
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
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

// 이미지는 처음 볼 때 저장하고, 다음부터 캐시를 먼저 보여준 뒤 갱신
registerRoute(
  ({ request, url }) =>
    request.destination === 'image' ||
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/.test(url.pathname),
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
