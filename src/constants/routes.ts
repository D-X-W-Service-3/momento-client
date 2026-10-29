export const ROUTES = {
  HOME: '/home',
  CALENDAR: '/calendar',
  CALENDAR_SEARCH: '/calendar/search',
  CAPSULE: '/capsule',
  /** 캡슐 상세 진입(커버) 화면 */
  CAPSULE_COVER: '/capsule/:capsuleId',
  /** 캡슐 상세 (정보/참여자/관리) */
  CAPSULE_DETAIL: '/capsule/:capsuleId/detail',
  /** 참여자 관리 */
  CAPSULE_PARTICIPANTS: '/capsule/:capsuleId/participants',
  /** 수신자 관리 */
  CAPSULE_RECEIVERS: '/capsule/:capsuleId/receivers',
  /** 캡슐 수정 폼 (방장 전용) */
  CAPSULE_EDIT: '/capsule/:capsuleId/edit',
  /** 개봉일 인트로 */
  CAPSULE_REVEAL: '/capsule/:capsuleId/reveal',
  /** 편지 작성 1단계: 편지지 화풍 선택 */
  LETTER_PAPER: '/capsule/:capsuleId/letters/new',
  /** 편지 작성 2단계: 제목/내용 입력 */
  LETTER_WRITE: '/capsule/:capsuleId/letters/new/write',
  ARCHIVE: '/archive',
  MYPAGE: '/mypage',
} as const;

export const capsuleCoverPath = (capsuleId: string) => `/capsule/${capsuleId}`;
export const capsuleDetailPath = (capsuleId: string) =>
  `/capsule/${capsuleId}/detail`;
export const capsuleParticipantsPath = (capsuleId: string) =>
  `/capsule/${capsuleId}/participants`;
export const capsuleReceiversPath = (capsuleId: string) =>
  `/capsule/${capsuleId}/receivers`;
export const capsuleEditPath = (capsuleId: string) =>
  `/capsule/${capsuleId}/edit`;
export const capsuleRevealPath = (capsuleId: string) =>
  `/capsule/${capsuleId}/reveal`;
export const letterPaperPath = (capsuleId: string) =>
  `/capsule/${capsuleId}/letters/new`;
export const letterWritePath = (capsuleId: string) =>
  `/capsule/${capsuleId}/letters/new/write`;
