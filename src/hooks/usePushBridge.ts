import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { syncPushSubscription } from '@/hooks/usePushNotification';
import { useAuthStore } from '@/stores/useAuthStore';

/** 서비스워커가 열린 앱 창에 보내는 메시지 (src/sw.ts 와 맞춘다) */
export const PUSH_NAVIGATE_MESSAGE = 'PUSH_NAVIGATE';

/**
 * 앱 전역에서 한 번 호출한다.
 * - 로그인 상태면 이 기기의 푸시 구독을 서버와 동기화
 * - 푸시 알림 클릭 시 SW 가 보낸 경로로 라우터 이동 (전체 새로고침 없이)
 */
export function usePushBridge() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    // 서버 API 가 아직 없거나 실패해도 화면 동작에는 영향이 없게 조용히 넘긴다.
    void syncPushSubscription().catch(() => undefined);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; path?: string } | null;
      if (data?.type === PUSH_NAVIGATE_MESSAGE && data.path) {
        navigate(data.path);
      }
    };
    navigator.serviceWorker.addEventListener('message', onMessage);
    return () =>
      navigator.serviceWorker.removeEventListener('message', onMessage);
  }, [navigate]);
}
