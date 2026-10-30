import { useQuery } from '@tanstack/react-query';

import {
  getCapsuleLetters,
  getLetterPapers,
  getMyLetters,
} from '@/apis/letter';

export const useLetterPapers = () =>
  useQuery({
    queryKey: ['letter', 'papers'],
    queryFn: getLetterPapers,
    staleTime: Infinity,
  });

export const useMyLetters = (capsuleId: string, enabled = true) =>
  useQuery({
    queryKey: ['letter', 'mine', capsuleId],
    queryFn: () => getMyLetters(capsuleId),
    enabled: enabled && Boolean(capsuleId),
  });

export const useCapsuleLetters = (capsuleId: string, enabled = true) =>
  useQuery({
    queryKey: ['letter', 'capsule', capsuleId],
    queryFn: () => getCapsuleLetters(capsuleId),
    enabled: enabled && Boolean(capsuleId),
  });
