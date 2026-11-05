import { useCallback, useEffect, useState } from 'react';
import {
  deletePushSubscription,
  fetchVapidPublicKey,
  registerPushSubscription,
} from '@/apis/push';
import {
  getCurrentPushSubscription,
  getPushSupport,
  getServiceWorkerRegistration,
  urlBase64ToUint8Array,
} from '@/utils/push';

export type PushStatus =
  'loading' | 'ios-needs-install' | 'unsupported' | 'denied' | 'off' | 'on';

/** 앱 진입 시: 이미 구독한 기기면 서버에 다시 등록(upsert)해 로그인 유저와 맞춘다. */
export async function syncPushSubscription() {
  if (getPushSupport() !== 'supported') return;
  if (Notification.permission !== 'granted') return;
  const subscription = await getCurrentPushSubscription();
  if (subscription) await registerPushSubscription(subscription.toJSON());
}

/**
 * 로그아웃 직전(토큰이 남아 있을 때) 서버에서 이 기기 구독을 지운다.
 * 브라우저 구독은 남겨 두어 다시 로그인하면 sync 로 이어서 받는다.
 */
export async function unregisterPushOnLogout() {
  const subscription = await getCurrentPushSubscription().catch(() => null);
  if (subscription) await deletePushSubscription(subscription.endpoint);
}

async function readStatus(): Promise<PushStatus> {
  const support = getPushSupport();
  if (support !== 'supported') return support;
  if (!(await getServiceWorkerRegistration())) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  const subscription = await getCurrentPushSubscription();
  return subscription && Notification.permission === 'granted' ? 'on' : 'off';
}

/** 알림 설정 화면의 "푸시 알림" 토글 */
export function usePushNotification() {
  const [status, setStatus] = useState<PushStatus>('loading');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    void readStatus().then((next) => {
      if (active) setStatus(next);
    });
    return () => {
      active = false;
    };
  }, []);

  const enable = useCallback(async () => {
    const registration = await getServiceWorkerRegistration();
    if (!registration) return;
    // iOS 는 사용자 탭 안에서만 권한 요청이 가능하므로 클릭 핸들러에서 바로 호출한다.
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      setStatus(permission === 'denied' ? 'denied' : 'off');
      return;
    }
    const { publicKey } = await fetchVapidPublicKey();
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      }));
    await registerPushSubscription(subscription.toJSON());
    setStatus('on');
  }, []);

  const disable = useCallback(async () => {
    const subscription = await getCurrentPushSubscription();
    if (subscription) {
      await deletePushSubscription(subscription.endpoint);
      await subscription.unsubscribe();
    }
    setStatus('off');
  }, []);

  const toggle = useCallback(async () => {
    if (isPending || (status !== 'on' && status !== 'off')) return;
    setIsPending(true);
    setError(null);
    try {
      await (status === 'on' ? disable() : enable());
    } catch (reason) {
      setError(reason as Error);
    } finally {
      setIsPending(false);
    }
  }, [disable, enable, isPending, status]);

  return { status, isPending, error, toggle };
}
