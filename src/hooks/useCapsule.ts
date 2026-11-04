import { useQuery } from '@tanstack/react-query';

import {
  getCapsuleCover,
  getCapsuleDetail,
  getCapsuleIcons,
  MOCK_CAPSULE_ICONS,
} from '@/apis/capsule';

export const useCapsuleCover = (capsuleId: string) =>
  useQuery({
    queryKey: ['capsule', 'cover', capsuleId],
    queryFn: () => getCapsuleCover(capsuleId),
    enabled: Boolean(capsuleId),
  });

export const useCapsuleDetail = (capsuleId: string) =>
  useQuery({
    queryKey: ['capsule', 'detail', capsuleId],
    queryFn: () => getCapsuleDetail(capsuleId),
    enabled: Boolean(capsuleId),
  });

export const useCapsuleIcons = () =>
  useQuery({
    queryKey: ['capsule', 'icons'],
    queryFn: getCapsuleIcons,
    initialData: MOCK_CAPSULE_ICONS,
    staleTime: Infinity,
  });
