import { useRef, useState } from 'react';
import {
  onlineManager,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout as requestLogout } from '@/apis/auth';
import { deleteMyAccount, fetchMyProfile, toMyPageData } from '@/apis/mypage';
import { unregisterPushOnLogout } from '@/hooks/usePushNotification';
import { useAuthStore } from '@/stores/useAuthStore';

const PUSH_CLEANUP_TIMEOUT_MS = 2500;

export function useMyPage() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const withdrawing = useRef(false);
  const query = useQuery({ queryKey: ['myProfile'], queryFn: fetchMyProfile });
  const clearSession = () => {
    useAuthStore.getState().logout();
    void client.cancelQueries();
    client.clear();
    navigate('/login', { replace: true });
  };
  const logout = useMutation({
    networkMode: 'always',
    mutationFn: async () => {
      // 오프라인에서도 onSuccess에서 로컬 세션을 바로 정리한다.
      if (!onlineManager.isOnline() || navigator.onLine === false) return;
      // 토큰을 지우기 전에 이 기기의 푸시 구독부터 서버에서 해제한다.
      const controller = new AbortController();
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          unregisterPushOnLogout(controller.signal).catch(() => undefined),
          new Promise<void>((resolve) => {
            timer = setTimeout(() => {
              controller.abort();
              resolve();
            }, PUSH_CLEANUP_TIMEOUT_MS);
          }),
        ]);
      } finally {
        clearTimeout(timer);
      }
      void requestLogout().catch(() => undefined);
    },
    onSuccess: clearSession,
  });
  const withdrawal = useMutation({
    mutationFn: deleteMyAccount,
    retry: false,
    onSuccess: clearSession,
    onSettled: () => {
      withdrawing.current = false;
    },
  });
  const data = query.data ? toMyPageData(query.data) : undefined;
  return {
    profile: data?.profile,
    activityStats: data?.activityStats,
    isLoading: query.isLoading,
    error: query.error,
    retry: query.refetch,
    logoutOpen,
    isLoggingOut: logout.isPending,
    withdrawOpen,
    isWithdrawing: withdrawal.isPending,
    withdrawError: withdrawal.error,
    handleBack: () => navigate(-1),
    handleEditProfile: () => navigate('/mypage/edit'),
    handleNotificationSettings: () => navigate('/mypage/notifications'),
    handleLogout: () => setLogoutOpen(true),
    cancelLogout: () => {
      if (!logout.isPending) setLogoutOpen(false);
    },
    confirmLogout: () => {
      if (!logout.isPending) logout.mutate();
    },
    handleWithdraw: () => {
      withdrawal.reset();
      setWithdrawOpen(true);
    },
    cancelWithdraw: () => {
      if (!withdrawal.isPending) setWithdrawOpen(false);
    },
    confirmWithdraw: () => {
      if (!withdrawal.isPending && !withdrawing.current) {
        withdrawing.current = true;
        withdrawal.mutate();
      }
    },
  };
}
