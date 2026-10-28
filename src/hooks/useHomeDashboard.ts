import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { fetchHomeDashboard } from '@/apis/home';

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
    navigate('/capsules');
  };

  const handleViewAllCapsules = () => {
    navigate('/capsules');
  };

  return {
    dashboard: query.data,
    isLoading: query.isLoading,
    handleNotifications,
    handleProfile,
    handleCreateCapsule,
    handleViewAllCapsules,
  };
}
