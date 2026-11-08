import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createLetter,
  deleteLetter,
  getCapsuleLetters,
  getLetterPapers,
  getMyLetters,
} from '@/apis/letter';
import { capsuleKeys } from '@/hooks/useCapsule';
import type { Letter, LetterCreateRequest } from '@/types/letter';
import { invalidateCapsuleQueries } from '@/utils/queryInvalidation';

export const letterKeys = {
  papers: ['letter', 'papers'] as const,
  mine: (capsuleId: string) => ['letter', 'mine', capsuleId] as const,
  capsule: (capsuleId: string) => ['letter', 'capsule', capsuleId] as const,
};

/** 이미지 생성 중인 편지가 있으면 30초마다 다시 조회한다 (한 장에 약 2분 30초) */
const IMAGE_POLL_INTERVAL = 30_000;
const pollWhileImagePending = (query: { state: { data?: Letter[] } }) =>
  query.state.data?.some((letter) => letter.imageStatus === 'PENDING')
    ? IMAGE_POLL_INTERVAL
    : false;

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
    refetchInterval: pollWhileImagePending,
  });

export const useCapsuleLetters = (capsuleId: string, enabled = true) =>
  useQuery({
    queryKey: letterKeys.capsule(capsuleId),
    queryFn: () => getCapsuleLetters(capsuleId),
    enabled: enabled && Boolean(capsuleId),
    refetchInterval: pollWhileImagePending,
  });

export const useCreateLetter = (capsuleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LetterCreateRequest) => createLetter(capsuleId, body),
    onSuccess: () => {
      void invalidateCapsuleQueries(queryClient);
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
      void invalidateCapsuleQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: letterKeys.mine(capsuleId) });
      queryClient.invalidateQueries({
        queryKey: capsuleKeys.detail(capsuleId),
      });
    },
  });
};
