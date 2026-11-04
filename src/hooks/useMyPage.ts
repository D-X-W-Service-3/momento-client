import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout as requestLogout } from '@/apis/auth';
import { deleteMyAccount, fetchMyProfile, toMyPageData } from '@/apis/mypage';
import { useAuthStore } from '@/stores/useAuthStore';

export function useMyPage() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const withdrawing = useRef(false);
  const query = useQuery({ queryKey: ['myProfile'], queryFn: fetchMyProfile });
  const clearSession = () => {
    useAuthStore.getState().logout();
    void client.cancelQueries();
    client.clear();
    navigate('/login', { replace: true });
  };
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
    withdrawOpen,
    isWithdrawing: withdrawal.isPending,
    withdrawError: withdrawal.error,
    handleBack: () => navigate(-1),
    handleEditProfile: () => navigate('/mypage/edit'),
    handleNotificationSettings: () => navigate('/mypage/notifications'),
    handleLogout: () => {
      void requestLogout().catch(() => undefined);
      clearSession();
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
