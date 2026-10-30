import cherryBlossom from '@/assets/images/letter-paper/cherry-blossom.webp';
import christmasFamily from '@/assets/images/letter-paper/christmas-family.webp';
import fireplaceCozy from '@/assets/images/letter-paper/fireplace-cozy.webp';
import neonStreet from '@/assets/images/letter-paper/neon-street.webp';
import winterTree from '@/assets/images/letter-paper/winter-tree.webp';
import letterImage from '@/assets/images/mock/letter-image.webp';
import type { Letter, LetterPaper } from '@/types/letter';

// TODO: 백엔드 API 확정 후 axios 호출로 교체.
export const getLetterPapers = async (): Promise<LetterPaper[]> => [
  { id: 'neon-street', name: '네온 거리', imageUrl: neonStreet },
  { id: 'winter-tree', name: '겨울 트리', imageUrl: winterTree },
  {
    id: 'christmas-family',
    name: '크리스마스 가족',
    imageUrl: christmasFamily,
  },
  { id: 'cherry-blossom', name: '벚꽃 생일', imageUrl: cherryBlossom },
  { id: 'fireplace-cozy', name: '벽난로 코지', imageUrl: fireplaceCozy },
];

const MOCK_LETTERS: Omit<Letter, 'imageUrl'>[] = [
  {
    id: '1',
    title: '2024 우리, 다시 만나는 날',
    content:
      '오늘 친구들과 함께 카페에서 오랜만에 만나서 정말 즐거운 시간을 보냈어. 웃음이 끊이지 않고, 서로의 근황도 나누면서 행복한 하루였어.\n테스트테스트테스트테스트테스트테스트',
    authorName: '유빈',
    date: '2027-03-01',
  },
  {
    id: '2',
    title: '그날의 우리에게',
    content:
      '바쁘게 지내다 보니 어느새 한 해가 다 갔네. 그래도 네가 있어서 버틸 수 있었어. 다시 만나는 날엔 더 많이 웃자.',
    authorName: '상미',
    date: '2027-03-02',
  },
  {
    id: '3',
    title: '잘 지내고 있지?',
    content:
      '이 편지를 읽을 때쯤이면 우리 모두 조금은 달라져 있겠지. 그래도 변하지 않는 게 하나쯤은 있었으면 좋겠다.',
    authorName: '지호',
    date: '2027-03-03',
  },
];

/** 내가 쓴 편지. 캡슐이 열리기 전이라 AI 이미지가 아직 없다. */
export const getMyLetters = async (_capsuleId: string): Promise<Letter[]> =>
  MOCK_LETTERS;

/** 열린 캡슐의 편지. AI 이미지가 함께 온다. */
export const getCapsuleLetters = async (
  _capsuleId: string,
): Promise<Letter[]> =>
  MOCK_LETTERS.map((letter) => ({ ...letter, imageUrl: letterImage }));
