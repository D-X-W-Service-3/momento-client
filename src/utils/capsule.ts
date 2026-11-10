import type { ChipTone } from '@/components/common/Chip';
import { capsuleIconSrc } from '@/constants/capsuleIcons';
import type {
  CapsuleInviteRole,
  CapsuleKind,
  CapsuleStatusType,
  CapsuleSummary,
} from '@/types/capsule';

export { capsuleIconSrc };

export interface CapsuleStatusChip {
  label: string;
  tone: ChipTone;
  /** 같은 줄에 붙는 "그룹캡슐" 칩의 톤 */
  groupTone: ChipTone;
}

export const capsuleTypeLabel: Record<CapsuleKind, string> = {
  FRIEND: '친구와의 캡슐',
  GROUP: '그룹 캡슐',
  SELF: '나만의 캡슐',
};

/**
 * 상세 화면 상태 칩. 목록에서도 개봉을 확인한 카드에 같은 칩을 쓴다.
 * 서버 status 3가지가 Figma 의 수정가능 / 잠긴캡슐 / 열린캡슐 과 1:1 이다.
 * 톤은 Figma 에서 칩 배경색을 찍어 맞췄다 (#fffbeb / #f2f1f9 / #f4f4f4).
 */
export const capsuleStatusChip = (
  status: CapsuleStatusType,
): CapsuleStatusChip => {
  if (status === 'WRITING') {
    return { label: '수정가능', tone: 'warning', groupTone: 'warning' };
  }
  if (status === 'LOCKED') {
    return { label: '잠긴캡슐', tone: 'info', groupTone: 'info' };
  }
  return { label: '열린캡슐', tone: 'neutral', groupTone: 'info' };
};

export const isGroupCapsule = (capsule: Pick<CapsuleSummary, 'capsuleType'>) =>
  capsule.capsuleType === 'GROUP';

/** 서버 초대 API의 유형·역할 조합. 서버 permissions와 함께 확인한다. */
export const canInviteRole = (
  capsuleType: CapsuleKind | undefined,
  role: CapsuleInviteRole,
) =>
  capsuleType === 'GROUP' ||
  (capsuleType === 'FRIEND' && role === 'PARTICIPANT');

/** URL 의 role 세그먼트(participant/receiver) → 서버 enum */
export const toInviteRole = (segment?: string): CapsuleInviteRole =>
  segment === 'receiver' || segment === 'RECIPIENT'
    ? 'RECIPIENT'
    : 'PARTICIPANT';
