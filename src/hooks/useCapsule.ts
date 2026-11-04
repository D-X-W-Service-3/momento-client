import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  acceptInvite,
  createInviteLink,
  deleteCapsule,
  getCapsuleDetail,
  getCapsuleIcons,
  getCapsuleMembers,
  getInvitePreview,
  MOCK_CAPSULE_ICONS,
  openCapsule,
  regenerateInviteLink,
  rejectInvite,
  removeCapsuleMember,
  updateCapsule,
  type CapsuleUpdateRequest,
} from '@/apis/capsule';
import type { CapsuleInvite, CapsuleInviteRole } from '@/types/capsule';
import { invalidateCapsuleQueries } from '@/utils/queryInvalidation';

export const capsuleKeys = {
  detail: (capsuleId: string) => ['capsule', 'detail', capsuleId] as const,
  members: (capsuleId: string, role: CapsuleInviteRole) =>
    ['capsule', 'members', capsuleId, role] as const,
  invite: (capsuleId: string, role: CapsuleInviteRole) =>
    ['capsule', 'invite', capsuleId, role] as const,
  invitePreview: (inviteToken: string) =>
    ['invite', 'preview', inviteToken] as const,
};

export const useCapsuleDetail = (capsuleId: string) =>
  useQuery({
    queryKey: capsuleKeys.detail(capsuleId),
    queryFn: () => getCapsuleDetail(capsuleId),
    enabled: Boolean(capsuleId),
  });

export const useCapsuleMembers = (capsuleId: string, role: CapsuleInviteRole) =>
  useQuery({
    queryKey: capsuleKeys.members(capsuleId, role),
    queryFn: () => getCapsuleMembers(capsuleId, role),
    enabled: Boolean(capsuleId),
  });

export const useCapsuleIcons = () =>
  useQuery({
    queryKey: ['capsule', 'icons'],
    queryFn: getCapsuleIcons,
    initialData: MOCK_CAPSULE_ICONS,
    staleTime: Infinity,
  });

export const useUpdateCapsule = (capsuleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CapsuleUpdateRequest) => updateCapsule(capsuleId, body),
    onSuccess: () => invalidateCapsuleQueries(queryClient),
  });
};

export const useDeleteCapsule = (capsuleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteCapsule(capsuleId),
    onSuccess: () => invalidateCapsuleQueries(queryClient),
  });
};

export const useRemoveCapsuleMember = (
  capsuleId: string,
  role: CapsuleInviteRole,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => removeCapsuleMember(capsuleId, memberId),
    onSuccess: () => {
      void invalidateCapsuleQueries(queryClient);
      // 내보내면 상세의 인원수·미리보기도 함께 바뀐다.
      queryClient.invalidateQueries({
        queryKey: capsuleKeys.members(capsuleId, role),
      });
      queryClient.invalidateQueries({
        queryKey: capsuleKeys.detail(capsuleId),
      });
    },
  });
};

export const useOpenCapsule = (capsuleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => openCapsule(capsuleId),
    onSuccess: () => invalidateCapsuleQueries(queryClient),
  });
};

/**
 * 초대 링크. 발급이 POST 지만 같은 역할이면 같은 링크를 돌려주므로
 * 시트가 열릴 때 한 번 받아 캐시해 둔다.
 */
export const useInviteLink = (
  capsuleId: string,
  role: CapsuleInviteRole,
  enabled: boolean,
) =>
  useQuery({
    queryKey: capsuleKeys.invite(capsuleId, role),
    queryFn: () => createInviteLink(capsuleId, role),
    enabled: enabled && Boolean(capsuleId),
    staleTime: Infinity,
  });

export const useRegenerateInviteLink = (
  capsuleId: string,
  role: CapsuleInviteRole,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => regenerateInviteLink(capsuleId, role),
    onSuccess: (invite: CapsuleInvite) =>
      queryClient.setQueryData(capsuleKeys.invite(capsuleId, role), invite),
  });
};

export const useInvitePreview = (inviteToken: string) =>
  useQuery({
    queryKey: capsuleKeys.invitePreview(inviteToken),
    queryFn: () => getInvitePreview(inviteToken),
    enabled: Boolean(inviteToken),
  });

export const useAcceptInvite = (inviteToken: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => acceptInvite(inviteToken),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: capsuleKeys.invitePreview(inviteToken),
      });
      return invalidateCapsuleQueries(queryClient);
    },
  });
};

export const useRejectInvite = (inviteToken: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => rejectInvite(inviteToken),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: capsuleKeys.invitePreview(inviteToken),
      });
      return invalidateCapsuleQueries(queryClient);
    },
  });
};
