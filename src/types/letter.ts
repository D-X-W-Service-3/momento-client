/* ------------------------------------------------------------------
 * 서버 enum (POST /v1/time-capsules/{id}/letters)
 * ---------------------------------------------------------------- */

/** 편지지 화풍. 개봉 시 AI 이미지의 그림체로 쓰인다. */
export type LetterThemeType =
  'PASTEL' | 'WATERCOLOR' | 'VINTAGE' | 'ANIME' | 'JOSEON';

/** 편지 용도. 기존 편지는 조회 시 null 일 수 있다. */
export type LetterType =
  'BIRTHDAY' | 'COUPLE_ANNIVERSARY' | 'CHRISTMAS' | 'GENERAL';

/** 서버 제한값. Figma 와 다르면 서버를 따른다 (초과 시 400). */
export const LETTER_TITLE_MAX_LENGTH = 50;
export const LETTER_CONTENT_MAX_LENGTH = 500;

export interface LetterCreateRequest {
  title: string;
  content: string;
  themeType: LetterThemeType;
  letterType: LetterType;
}

/* ------------------------------------------------------------------
 * 서버 응답
 * ---------------------------------------------------------------- */

/**
 * 편지 AI 이미지 생성 상태. 제출하면 PENDING 이 되고 한 장에 약 2분 30초 걸린다.
 * COMPLETED 일 때만 imageUrl 이 있고, FAILED·null(예전 편지)은 이미지 없이 보여 준다.
 */
export type LetterImageStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

/** GET /v1/time-capsules/{id}/letters/me */
export interface MyLetterResponse {
  letterId: number;
  letterType: LetterType | null;
  themeType: LetterThemeType | null;
  title: string | null;
  content: string;
  createdAt: string;
  /** 작성 마감·공개 시각 전이면 true. 삭제 버튼 노출 조건이다. */
  canDelete: boolean;
  /** COMPLETED 일 때만 조회용 presigned URL (1시간 유효) */
  imageUrl: string | null;
  imageStatus: LetterImageStatus | null;
}

/** GET /v1/time-capsules/{id}/letters 의 letters 항목 */
export interface CapsuleLetterResponse {
  letterId: number;
  letterType: LetterType | null;
  themeType: LetterThemeType | null;
  title: string | null;
  content: string;
  authorNickname: string;
  createdAt: string;
  /** COMPLETED 일 때만 조회용 presigned URL (1시간 유효) */
  imageUrl: string | null;
  imageStatus: LetterImageStatus | null;
}

/* ------------------------------------------------------------------
 * 화면용 뷰모델. 열람 모달(LetterViewer)이 쓰는 형태다.
 * ---------------------------------------------------------------- */

export interface Letter {
  id: string;
  title: string;
  content: string;
  authorName: string;
  /** 작성일 (YYYY-MM-DD) */
  date: string;
  /** 편지를 제출하면 만들기 시작하는 AI 이미지 */
  imageUrl?: string;
  /** PENDING 이면 '이미지 생성 중' 을 보여 준다 */
  imageStatus?: LetterImageStatus | null;
  /** 삭제 가능 여부. 내가 쓴 편지에만 들어온다. */
  canDelete?: boolean;
}

/** 편지지 화풍 선택 카드. themeType 으로 변환해 서버에 보낸다. */
export interface LetterPaper {
  id: string;
  name: string;
  imageUrl: string;
  themeType: LetterThemeType;
}
