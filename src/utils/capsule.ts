import capsuleHero from '@/assets/images/capsule/capsule-hero.webp';
import type { ChipTone } from '@/components/common/Chip';
import type {
  CapsuleInviteRole,
  CapsuleStatusType,
  CapsuleSummary,
} from '@/types/capsule';

/**
 * 서버는 대표 아이콘을 iconType 문자열로만 준다.
 * TODO: 아이콘 세트가 확정되면 iconType ↔ 에셋 매핑으로 교체.
 */
export const capsuleIconSrc = (_iconType: string) => capsuleHero;

export interface CapsuleStatusChip {
  label: string;
  tone: ChipTone;
  /** 같은 줄에 붙는 "그룹캡슐" 칩의 톤 */
  groupTone: ChipTone;
}

/**
 * 상태 칩. 목록 카드와 문구가 달라 상세 전용이다.
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

/** URL 의 role 세그먼트(participant/receiver) → 서버 enum */
export const toInviteRole = (segment?: string): CapsuleInviteRole =>
  segment === 'receiver' || segment === 'RECIPIENT'
    ? 'RECIPIENT'
    : 'PARTICIPANT';
