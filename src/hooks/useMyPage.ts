import { useNavigate } from 'react-router-dom';

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
    logout();
    navigate('/login');
  };

  const handleWithdraw = () => {
    logout();
    navigate('/login');
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
