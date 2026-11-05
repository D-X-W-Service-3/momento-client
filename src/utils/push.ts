/**
 * 웹 푸시(VAPID) 브라우저 쪽 유틸.
 * 서비스워커는 프로덕션 빌드에서만 등록되므로(dev 비활성) 개발 서버에서는 미지원으로 본다.
 */

export type PushSupport =
  | 'supported'
  /** iOS Safari 탭: 홈 화면에 추가한 앱에서만 푸시를 받을 수 있다 (iOS 16.4+) */
  | 'ios-needs-install'
  | 'unsupported';

const isIos = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

export function getPushSupport(): PushSupport {
  const hasApis =
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;
  if (hasApis) return 'supported';
  if (isIos() && !isStandalone()) return 'ios-needs-install';
  return 'unsupported';
}

/** 등록된 서비스워커. dev 서버처럼 SW 가 없으면 null (ready 는 영원히 대기하므로 쓰지 않는다) */
export async function getServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) return null;
  const registration = await navigator.serviceWorker.getRegistration();
  return registration?.active ? registration : null;
}

export async function getCurrentPushSubscription() {
  const registration = await getServiceWorkerRegistration();
  return registration ? registration.pushManager.getSubscription() : null;
}

/** base64url VAPID 공개키 → applicationServerKey */
export function urlBase64ToUint8Array(base64Url: string) {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}
