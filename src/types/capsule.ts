import type { ChipTone } from '@/components/common/Chip';

export type CapsuleFilterKey = 'all' | 'editable' | 'locked' | 'opened';

export interface CapsuleCoverNavigationState {
  openingFinished: boolean;
  showOpeningFlash?: boolean;
}

export interface CapsuleChipBadge {
  label: string;
  tone: ChipTone;
}

export interface CapsuleFeaturedItem {
  id: string;
  statusLabel: string;
  dDayText: string;
  title: string;
  description: string;
  countText: string;
  openDateText: string;
}

export interface CapsuleHorizontalItem {
  id: string;
  badge: CapsuleChipBadge;
  title: string;
  openDateText: string;
}

export interface CapsuleListItem {
  id: string;
  year: number;
  filterCategory: Exclude<CapsuleFilterKey, 'all'>;
  variant: 'gradient' | 'white' | 'translucent';
  badges: CapsuleChipBadge[];
  title: string;
  description: string;
  dDayText?: string;
  dateText: string;
  countText: string;
}

export interface CapsuleFilterChipOption {
  key: CapsuleFilterKey;
  label: string;
  count: number;
}

export interface CapsuleHomeData {
  hasPendingRequest: boolean;
  featuredCapsules: CapsuleFeaturedItem[];
  editableCapsules: CapsuleHorizontalItem[];
  lockedCapsules: CapsuleHorizontalItem[];
  openedCapsules: CapsuleHorizontalItem[];
}

export interface CapsuleListData {
  filters: CapsuleFilterChipOption[];
  items: CapsuleListItem[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface CapsuleCardResponse {
  capsuleId: number;
  iconType: string;
  title: string;
  description: string | null;
  status: CapsuleStatusType;
  openedByMe: boolean;
  openAt: string;
  dDay: number;
  deadlineDDay: number | null;
  memberCount: number;
  letterCount: number;
}

export interface CapsuleOverviewResponse {
  hasPendingInvite: boolean;
  upcoming: CapsuleCardResponse[];
  writing: CapsuleCardResponse[];
  locked: CapsuleCardResponse[];
  opened: CapsuleCardResponse[];
}

export interface CapsuleListResponse {
  counts: { all: number; opened: number; writing: number; locked: number };
  capsules: CapsuleCardResponse[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface ReceivedInvite {
  inviteToken: string;
  targetRole: CapsuleInviteRole;
  inviterNickname: string;
  capsuleId: number;
  capsuleTitle: string;
  openAt: string;
}

export type CapsuleCreateType = 'solo' | 'friend' | 'group';

export type CapsuleVisibilityType = 'all_participants' | 'designated_only';

export type CapsuleCreateStep =
  'info' | 'type' | 'visibility' | 'dates' | 'complete';

export interface CapsuleCreateForm {
  iconIndex: number;
  name: string;
  description: string;
  capsuleType: CapsuleCreateType;
  visibility: CapsuleVisibilityType;
  /** '2026년 11월 20일' */
  editDeadline: string;
  /** '오후 3:15' */
  editDeadlineTime: string;
  openDate: string;
  openTime: string;
}

/* ------------------------------------------------------------------
 * 서버 응답 타입 (GET /v1/time-capsules/{capsuleId} 등)
 * 값과 이름은 OpenAPI 스펙을 그대로 따른다.
 * ---------------------------------------------------------------- */

export type CapsuleStatusType = 'WRITING' | 'LOCKED' | 'OPENED';
export type CapsuleKind = 'SELF' | 'FRIEND' | 'GROUP';
export type CapsuleVisibility = 'RECIPIENT_AND_AUTHOR' | 'ALL_MEMBERS';
/** 캡슐 안에서의 역할. 멤버 목록 조회의 role 파라미터로도 쓴다. */
export type CapsuleRole = 'OWNER' | 'RECIPIENT' | 'PARTICIPANT';

/** 초대·멤버 관리 화면에서 다루는 역할. 방장은 초대 대상이 아니다. */
export type CapsuleInviteRole = Exclude<CapsuleRole, 'OWNER'>;

/** 상세 화면에서 버튼·섹션 노출을 결정한다. 클라이언트가 추론하지 않는다. */
export interface CapsulePermissions {
  canWriteLetter: boolean;
  canInvite: boolean;
  canManage: boolean;
  canDelete: boolean;
  canViewLetters: boolean;
}

/** 아바타 미리보기 (최대 5명) */
export interface CapsuleMemberPreview {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface CapsuleMemberGroup {
  count: number;
  previews: CapsuleMemberPreview[];
}

export interface CapsuleDetail {
  capsuleId: number;
  iconType: string;
  title: string;
  description: string | null;
  capsuleType: CapsuleKind;
  visibilityType: CapsuleVisibility;
  status: CapsuleStatusType;
  openedByMe: boolean;
  /** ISO datetime */
  letterDeadlineAt: string;
  openAt: string;
  /** 개봉일까지 남은 일수. 당일 0, 지나면 음수 */
  dDay: number;
  memberCount: number;
  letterCount: number;
  myRole: CapsuleRole;
  participants: CapsuleMemberGroup;
  recipients: CapsuleMemberGroup;
  permissions: CapsulePermissions;
}

/** 멤버 관리 화면에서 쓰는 전체 목록 */
export interface CapsuleMember {
  /** 내보내기에 쓰는 식별자. userId 와 다르다. */
  memberId: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  isOwner: boolean;
}

export interface CapsuleMemberList {
  role: CapsuleRole;
  count: number;
  /** 초대·내보내기 가능 여부 (방장이고 WRITING 일 때) */
  canManage: boolean;
  members: CapsuleMember[];
}

/* ------------------------------------------------------------------
 * 초대 (POST /v1/time-capsules/{id}/invites, GET /v1/invites/{token})
 * ---------------------------------------------------------------- */

export interface CapsuleInvite {
  inviteId: number;
  targetRole: CapsuleInviteRole;
  inviteToken: string;
  /** 만료 일시. 없으면 null */
  expiresAt: string | null;
}

/** 초대 미리보기에 실려오는 캡슐 요약. 상세 응답에서 권한만 빠진 형태다. */
export interface CapsuleSummary {
  capsuleId: number;
  iconType: string;
  title: string;
  description: string | null;
  capsuleType: CapsuleKind;
  status: CapsuleStatusType;
  openAt: string;
  memberCount: number;
  letterCount: number;
  participants: CapsuleMemberGroup;
  recipients: CapsuleMemberGroup;
}

export interface CapsuleInvitePreview {
  targetRole: CapsuleInviteRole;
  /** 이미 멤버면 수락 화면 대신 캡슐 상세로 보낸다. */
  alreadyJoined: boolean;
  capsule: CapsuleSummary;
}

/** 캡슐 대표 아이콘 후보 */
export interface CapsuleIconOption {
  id: string;
  imageUrl: string;
}

/** 캡슐 이름/설명 글자수 제한 (생성·수정 공통) */
export const CAPSULE_NAME_MAX_LENGTH = 20;
export const CAPSULE_DESCRIPTION_MAX_LENGTH = 45;
/** 생성 시 설명은 앞뒤 공백을 제외하고 5자 이상 입력한다. */
export const CAPSULE_DESCRIPTION_MIN_LENGTH = 5;
