import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { fetchHomeDashboard } from '@/apis/home';
import { capsuleCoverPath } from '@/constants/routes';

export function useHomeDashboard() {
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['homeDashboard'],
    queryFn: fetchHomeDashboard,
  });

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleProfile = () => {
    navigate('/mypage');
  };

  const handleCreateCapsule = () => {
    navigate('/capsules/new');
  };

  const handleViewAllCapsules = () => {
    navigate('/capsules');
  };

  const handleSelectCapsule = (capsuleId: string) => {
    navigate(capsuleCoverPath(capsuleId));
  };

  return {
    dashboard: query.data,
    isLoading: query.isLoading,
    handleNotifications,
    handleProfile,
    handleCreateCapsule,
    handleViewAllCapsules,
    handleSelectCapsule,
  };
}
