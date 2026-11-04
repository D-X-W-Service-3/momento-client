export const ROUTES = {
  LOGIN: '/login',
  HOME: '/home',
  CALENDAR: '/calendar',
  CALENDAR_SEARCH: '/calendar/search',
  CAPSULE: '/capsules',
  /** 캡슐 상세 진입(커버) 화면 */
  CAPSULE_COVER: '/capsules/:capsuleId',
  /** 캡슐 상세 (정보/참여자/관리) */
  CAPSULE_DETAIL: '/capsules/:capsuleId/detail',
  /** 참여자 관리 */
  CAPSULE_PARTICIPANTS: '/capsules/:capsuleId/participants',
  /** 수신자 관리 */
  CAPSULE_RECEIVERS: '/capsules/:capsuleId/receivers',
  /** 캡슐 수정 폼 (방장 전용) */
  CAPSULE_EDIT: '/capsules/:capsuleId/edit',
  /** 개봉일 인트로 */
  CAPSULE_REVEAL: '/capsules/:capsuleId/reveal',
  /** 초대 링크로 들어온 캡슐 커버. 서버가 발급한 inviteToken 으로 식별한다. */
  INVITE: '/invites/:inviteToken',
  /** 초대 수락 전 캡슐 상세 */
  INVITE_DETAIL: '/invites/:inviteToken/detail',
  /** 편지 작성 1단계: 편지 유형 선택 */
  LETTER_TYPE: '/capsules/:capsuleId/letters/new',
  /** 편지 작성 2단계: 편지지 화풍 선택 */
  LETTER_PAPER: '/capsules/:capsuleId/letters/new/theme',
  /** 편지 작성 3단계: 제목/내용 입력 */
  LETTER_WRITE: '/capsules/:capsuleId/letters/new/write',
  ARCHIVE: '/archive',
  MYPAGE: '/mypage',
} as const;

export const capsuleCoverPath = (capsuleId: string) => `/capsules/${capsuleId}`;
export const capsuleDetailPath = (capsuleId: string) =>
  `/capsules/${capsuleId}/detail`;
export const capsuleParticipantsPath = (capsuleId: string) =>
  `/capsules/${capsuleId}/participants`;
export const capsuleReceiversPath = (capsuleId: string) =>
  `/capsules/${capsuleId}/receivers`;
export const capsuleEditPath = (capsuleId: string) =>
  `/capsules/${capsuleId}/edit`;
export const capsuleRevealPath = (capsuleId: string) =>
  `/capsules/${capsuleId}/reveal`;
export const invitePath = (inviteToken: string) => `/invites/${inviteToken}`;
export const inviteDetailPath = (inviteToken: string) =>
  `/invites/${inviteToken}/detail`;
export const letterTypePath = (capsuleId: string) =>
  `/capsules/${capsuleId}/letters/new`;
export const letterPaperPath = (capsuleId: string) =>
  `/capsules/${capsuleId}/letters/new/theme`;
export const letterWritePath = (capsuleId: string) =>
  `/capsules/${capsuleId}/letters/new/write`;
