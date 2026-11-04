import anime from '@/assets/images/letter-paper/anime.webp';
import joseon from '@/assets/images/letter-paper/joseon.webp';
import pastel from '@/assets/images/letter-paper/pastel.webp';
import vintage from '@/assets/images/letter-paper/vintage.webp';
import watercolor from '@/assets/images/letter-paper/watercolor.webp';
import { api } from '@/apis/client';
import type {
  CapsuleLetterResponse,
  Letter,
  LetterCreateRequest,
  LetterPaper,
  MyLetterResponse,
} from '@/types/letter';

/**
 * 편지지 화풍. Figma 레이어 이름(water / pstl / anime / josen / vintage)이
 * 서버 themeType 과 1:1 로 대응한다. 배열 순서가 화면에 보이는 순서다.
 */
const LETTER_PAPERS: LetterPaper[] = [
  {
    id: 'watercolor',
    name: '수채화',
    imageUrl: watercolor,
    themeType: 'WATERCOLOR',
  },
  { id: 'pastel', name: '파스텔', imageUrl: pastel, themeType: 'PASTEL' },
  { id: 'anime', name: '애니메이션', imageUrl: anime, themeType: 'ANIME' },
  { id: 'joseon', name: '조선시대', imageUrl: joseon, themeType: 'JOSEON' },
  { id: 'vintage', name: '빈티지', imageUrl: vintage, themeType: 'VINTAGE' },
];

// 편지지 이미지는 프론트 에셋이라 서버 호출이 없다. 훅 인터페이스만 맞춘다.
export const getLetterPapers = async (): Promise<LetterPaper[]> =>
  LETTER_PAPERS;

export const findLetterPaper = (paperId: string) =>
  LETTER_PAPERS.find((paper) => paper.id === paperId);

/** ISO datetime → YYYY-MM-DD */
const toDateOnly = (createdAt: string) => createdAt.slice(0, 10);

/**
 * 내가 쓴 편지.
 * 서버는 캡슐당 내 편지를 하나만 돌려주지만, 열람 모달이 배열을 받으므로
 * 0~1개 배열로 감싼다.
 */
export async function getMyLetters(capsuleId: string): Promise<Letter[]> {
  const letter = await api.get<MyLetterResponse | null>(
    `/v1/time-capsules/${capsuleId}/letters/me`,
    { allowCodes: ['LETTER_NOT_FOUND'] },
  );
  if (!letter) return [];

  return [
    {
      id: String(letter.letterId),
      title: letter.title ?? '',
      content: letter.content,
      authorName: '나',
      date: toDateOnly(letter.createdAt),
      canDelete: letter.canDelete,
    },
  ];
}

/** 개봉된 캡슐의 전체 편지. 개봉 전에는 빈 배열이다. */
export async function getCapsuleLetters(capsuleId: string): Promise<Letter[]> {
  const data = await api.get<{ letters: CapsuleLetterResponse[] } | null>(
    `/v1/time-capsules/${capsuleId}/letters`,
    { allowCodes: ['CAPSULE_NOT_OPENED'] },
  );

  return (data?.letters ?? []).map((letter) => ({
    id: String(letter.letterId),
    title: letter.title ?? '',
    content: letter.content,
    authorName: letter.authorNickname,
    date: toDateOnly(letter.createdAt),
    imageUrl: letter.imageUrl ?? undefined,
  }));
}

export const createLetter = (capsuleId: string, body: LetterCreateRequest) =>
  api.post<void>(`/v1/time-capsules/${capsuleId}/letters`, body);

export const deleteLetter = (letterId: string) =>
  api.delete<void>(`/v1/letters/${letterId}`);
