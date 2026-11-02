import { useNavigate } from 'react-router-dom';

import { logout as requestLogout } from '@/apis/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMyPageStore } from '@/stores/useMyPageStore';

export function useMyPage() {
  const navigate = useNavigate();
  const profile = useMyPageStore((state) => state.profile);
  const activityStats = useMyPageStore((state) => state.activityStats);
  const logout = useAuthStore((state) => state.logout);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    navigate('/mypage/edit');
  };

  const handleNotificationSettings = () => {
    navigate('/mypage/notifications');
  };

  const handleLogout = () => {
    // 서버 세션 정리는 실패해도 로컬 로그아웃은 그대로 진행한다.
    void requestLogout().catch(() => undefined);
    logout();
    navigate('/login', { replace: true });
  };

  // TODO: DELETE /v1/users/me 연결
  const handleWithdraw = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return {
    profile,
    activityStats,
    handleBack,
    handleEditProfile,
    handleNotificationSettings,
    handleLogout,
    handleWithdraw,
  };
}
