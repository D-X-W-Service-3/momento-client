import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchHomeDashboard, remainingUntil } from '@/apis/home';
import { capsuleCoverPath } from '@/constants/routes';
import { serverDate } from '@/utils/capsuleCards';

export function useHomeDashboard() {
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['homeDashboard'],
    queryFn: fetchHomeDashboard,
  });
  const [now, setNow] = useState(Date.now);
  const refetch = query.refetch;
  const openAt = query.data?.heroCapsule?.openAt;
  useEffect(() => {
    if (!openAt) return;
    let refreshed = false;
    const timer = window.setInterval(() => {
      const next = Date.now();
      setNow(next);
      if (!refreshed && next >= serverDate(openAt).getTime()) {
        refreshed = true;
        void refetch();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [openAt, refetch]);

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
    dashboard: query.data
      ? {
          ...query.data,
          heroCapsule: query.data.heroCapsule
            ? {
                ...query.data.heroCapsule,
                remainingTime: remainingUntil(
                  query.data.heroCapsule.openAt,
                  now,
                ),
              }
            : null,
        }
      : undefined,
    isLoading: query.isLoading,
    error: query.error,
    retry: query.refetch,
    handleNotifications,
    handleProfile,
    handleCreateCapsule,
    handleViewAllCapsules,
    handleSelectCapsule,
  };
}
