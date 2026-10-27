import type { Archive, Capsule } from '@/types/momento';

export const archiveImages = Array.from(
  { length: 8 },
  (_, index) =>
    `/assets/archive/memory-${String(index + 1).padStart(2, '0')}.jpg`,
);

export const archives: Archive[] = [
  {
    id: 1,
    title: '1년 후의 나에게',
    date: '2027년 3월 1일',
    year: 2026,
    author: '유빈',
    content:
      '오늘 친구들과 함께 카페에서 오랜만에 만나서 정말 즐거운 시간을 보냈어. 웃음이 끊이지 않고, 서로의 근황도 나누면서 행복한 하루였어.',
    images: [
      archiveImages[3],
      archiveImages[2],
      archiveImages[4],
      archiveImages[5],
    ],
  },
  {
    id: 2,
    title: '새로운 도전을 향해\n한 걸음씩 나아가자',
    date: '2028년 7월 15일',
    year: 2026,
    author: '민수',
    content: '두려워도 멈추지 않고 새로운 도전을 시작한 오늘을 기억하자.',
    images: [archiveImages[2], archiveImages[4], archiveImages[5]],
  },
  {
    id: 3,
    title: '계절이 바뀌어도\n내 꿈은 변함없다',
    date: '2029년 11월 23일',
    year: 2026,
    author: '지현',
    content: '바람이 선선해진 가을, 변함없는 꿈을 다시 적어 본다.',
    images: [archiveImages[5], archiveImages[4], archiveImages[6]],
  },
  {
    id: 4,
    title: '웃음과 행복이 가득한\n하루가 되길',
    date: '2030년 5월 9일',
    year: 2026,
    author: '서연',
    content: '소중한 사람들과 마음껏 웃은 평범하고 특별한 하루.',
    images: [archiveImages[0], archiveImages[1]],
  },
  {
    id: 5,
    title: '과거의 나에게 보내는\n따뜻한 격려',
    date: '2031년 1월 30일',
    year: 2026,
    author: '준호',
    content: '지금도 충분히 잘하고 있다고 꼭 말해주고 싶어.',
    images: [archiveImages[4], archiveImages[6]],
  },
  {
    id: 6,
    title: '가을의 기억\n산책로에서의 휴식',
    date: '2027년 9월 30일',
    year: 2027,
    author: '지은',
    content: '낙엽 소리를 들으며 천천히 걸었던 오후.',
    images: [archiveImages[6], archiveImages[7]],
  },
  {
    id: 7,
    title: '크리스마스의 기적\n따뜻한 가족 모임',
    date: '2027년 12월 25일',
    year: 2027,
    author: '서준',
    content: '오랜만에 온 가족이 모인 따뜻한 크리스마스.',
    images: [archiveImages[1]],
  },
  {
    id: 8,
    title: '새해 결심\n더 나은 나를 향해',
    date: '2028년 1월 1일',
    year: 2027,
    author: '하늘',
    content: '새해의 첫날, 한 걸음씩 더 나은 내가 되기로 다짐했다.',
    images: [archiveImages[7]],
  },
];

export const capsules: Capsule[] = [
  {
    id: 1,
    title: '새로운 시작의 아침',
    date: '2026년 4월 15일 개봉',
    status: 'open',
    meta: '5명 | 편지 3',
  },
  {
    id: 2,
    title: '추억 속의 여행',
    date: '2026년 5월 20일 개봉',
    status: 'sealed',
    meta: '5명 | 편지 3',
  },
  {
    id: 3,
    title: '마음의 소리',
    date: '2026년 6월 10일 개봉',
    status: 'writing',
    meta: '5명 | 편지 3',
  },
];
