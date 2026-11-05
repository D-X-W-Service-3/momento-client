import { api } from '@/apis/client';
import { CAPSULE_ICONS } from '@/constants/capsuleIcons';
import type {
  CapsuleDetail,
  CapsuleIconOption,
  CapsuleInvite,
  CapsuleInvitePreview,
  CapsuleInviteRole,
  CapsuleMemberList,
  CapsuleRole,
} from '@/types/capsule';

export const getCapsuleDetail = (capsuleId: string) =>
  api.get<CapsuleDetail>(`/v1/time-capsules/${capsuleId}`);

export const getCapsuleMembers = (capsuleId: string, role: CapsuleRole) =>
  api.get<CapsuleMemberList>(
    `/v1/time-capsules/${capsuleId}/members?role=${role}`,
  );

export const removeCapsuleMember = (capsuleId: string, memberId: number) =>
  api.delete<void>(`/v1/time-capsules/${capsuleId}/members/${memberId}`);

export interface CapsuleUpdateRequest {
  /** 비울 수 없다 */
  iconType: string;
  /** 비울 수 없고 20자 이하 */
  title: string;
  /** 45자 이하. 빈 문자열을 보내면 지워진다. */
  description: string;
}

export const updateCapsule = (capsuleId: string, body: CapsuleUpdateRequest) =>
  api.patch<void>(`/v1/time-capsules/${capsuleId}`, body);

export const deleteCapsule = (capsuleId: string) =>
  api.delete<void>(`/v1/time-capsules/${capsuleId}`);

/** 개봉 화면을 확인했다고 서버에 알린다. */
export const openCapsule = (capsuleId: string) =>
  api.post<void>(`/v1/time-capsules/${capsuleId}/open`);

/* ------------------------------------------------------------------
 * 초대
 * ---------------------------------------------------------------- */

export const createInviteLink = (capsuleId: string, role: CapsuleInviteRole) =>
  api.post<CapsuleInvite>(`/v1/time-capsules/${capsuleId}/invites`, {
    targetRole: role,
  });

export const regenerateInviteLink = (
  capsuleId: string,
  role: CapsuleInviteRole,
) =>
  api.post<CapsuleInvite>(`/v1/time-capsules/${capsuleId}/invites/regenerate`, {
    targetRole: role,
  });

/** 서버는 토큰만 주므로 공유할 주소는 프론트에서 만든다. */
export const inviteUrlOf = (inviteToken: string) =>
  `${window.location.origin}/invites/${inviteToken}`;

export const getInvitePreview = (inviteToken: string) =>
  api.get<CapsuleInvitePreview>(`/v1/invites/${inviteToken}`);

export const acceptInvite = (inviteToken: string) =>
  api.post<void>(`/v1/invites/${inviteToken}/accept`);

export const rejectInvite = (inviteToken: string) =>
  api.post<void>(`/v1/invites/${inviteToken}/reject`);

export const getCapsuleIcons = async (): Promise<CapsuleIconOption[]> =>
  CAPSULE_ICONS;
