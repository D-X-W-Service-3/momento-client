import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createLetter,
  deleteLetter,
  getCapsuleLetters,
  getLetterPapers,
  getMyLetters,
} from '@/apis/letter';
import { capsuleKeys } from '@/hooks/useCapsule';
import type { LetterCreateRequest } from '@/types/letter';

export const letterKeys = {
  papers: ['letter', 'papers'] as const,
  mine: (capsuleId: string) => ['letter', 'mine', capsuleId] as const,
  capsule: (capsuleId: string) => ['letter', 'capsule', capsuleId] as const,
};

export const useLetterPapers = () =>
  useQuery({
    queryKey: letterKeys.papers,
    queryFn: getLetterPapers,
    staleTime: Infinity,
  });

export const useMyLetters = (capsuleId: string, enabled = true) =>
  useQuery({
    queryKey: letterKeys.mine(capsuleId),
    queryFn: () => getMyLetters(capsuleId),
    enabled: enabled && Boolean(capsuleId),
  });

export const useCapsuleLetters = (capsuleId: string, enabled = true) =>
  useQuery({
    queryKey: letterKeys.capsule(capsuleId),
    queryFn: () => getCapsuleLetters(capsuleId),
    enabled: enabled && Boolean(capsuleId),
  });

export const useCreateLetter = (capsuleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LetterCreateRequest) => createLetter(capsuleId, body),
    onSuccess: () => {
      // 편지 수가 상세 화면에도 찍힌다.
      queryClient.invalidateQueries({ queryKey: letterKeys.mine(capsuleId) });
      queryClient.invalidateQueries({
        queryKey: capsuleKeys.detail(capsuleId),
      });
    },
  });
};

export const useDeleteLetter = (capsuleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (letterId: string) => deleteLetter(letterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: letterKeys.mine(capsuleId) });
      queryClient.invalidateQueries({
        queryKey: capsuleKeys.detail(capsuleId),
      });
    },
  });
};
