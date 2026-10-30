import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { fetchCapsuleHomeData } from '@/apis/capsules';
import { capsuleCoverPath } from '@/constants/routes';
import type { CapsuleFilterKey } from '@/types/capsule';

export function useCapsuleHome() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const query = useQuery({
    queryKey: ['capsuleHome'],
    queryFn: fetchCapsuleHomeData,
  });

  const handleSearchClick = () => {
    navigate('/capsules/list?focus=search');
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleViewList = (filter?: CapsuleFilterKey) => {
    if (filter && filter !== 'all') {
      navigate(`/capsules/list?filter=${filter}`);
      return;
    }
    navigate('/capsules/list');
  };

  const handleSelectCapsule = (capsuleId: string) => {
    navigate(capsuleCoverPath(capsuleId));
  };

  const handleSelectSlide = (index: number) => {
    setActiveSlide(index);
  };

  return {
    data: query.data,
    activeSlide,
    totalSlides: 4,
    editableCapsules: query.data?.editableCapsules ?? [],
    lockedCapsules: query.data?.lockedCapsules ?? [],
    openedCapsules: query.data?.openedCapsules ?? [],
    handleSearchClick,
    handleNotifications,
    handleViewList,
    handleSelectCapsule,
    handleSelectSlide,
  };
}
