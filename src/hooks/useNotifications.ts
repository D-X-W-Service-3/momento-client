import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { fetchNotifications } from '@/apis/notifications';

export function useNotifications() {
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const handleBack = () => {
    navigate(-1);
  };

  return {
    notifications: query.data ?? [],
    isLoading: query.isLoading,
    handleBack,
  };
}
