/** 편지지 화풍. 캡슐이 열릴 때 AI 이미지의 배경 스타일로 쓰인다. */
export interface LetterPaper {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Letter {
  id: string;
  title: string;
  content: string;
  authorName: string;
  /** 작성일 (YYYY-MM-DD) */
  date: string;
  /** 캡슐이 열린 뒤에만 생기는 AI 이미지 */
  imageUrl?: string;
}
