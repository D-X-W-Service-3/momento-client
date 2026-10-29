import dayjs from 'dayjs';

import archiveImage1 from '@/assets/images/mock/archive-1.jpg';
import archiveImage2 from '@/assets/images/mock/archive-2.jpg';
import archiveImage3 from '@/assets/images/mock/archive-3.jpg';
import type { ArchiveSummary, CapsuleSummary } from '@/types/calendar';
import { toDateKey } from '@/utils/date';

// TODO: 백엔드 API 확정 후 삭제. 오늘 기준으로 생성되는 목업 데이터.
export const createMockCapsules = (): CapsuleSummary[] => {
  const today = dayjs();

  return [
    {
      id: 'capsule-1',
      title: '새로운 시작의 아침',
      openDate: toDateKey(today),
      status: 'openable',
      memberCount: 5,
      letterCount: 3,
    },
    {
      id: 'capsule-2',
      title: '추억 속의 여행',
      openDate: toDateKey(today.add(80, 'day')),
      status: 'sealed',
      memberCount: 5,
      letterCount: 3,
    },
    {
      id: 'capsule-3',
      title: '마음의 소리',
      openDate: toDateKey(today.add(101, 'day')),
      status: 'writing',
      memberCount: 5,
      letterCount: 3,
    },
  ];
};

export const createMockArchives = (): ArchiveSummary[] => [
  {
    id: 'archive-1',
    title: '1년 후의 나에게',
    date: '2027-03-01',
    photoCount: 4,
    authorName: '유빈',
    thumbnailUrl: archiveImage1,
  },
  {
    id: 'archive-2',
    title: '새로운 도전을 향해\n한 걸음씩 나아가자',
    date: '2028-07-15',
    photoCount: 7,
    authorName: '민수',
    thumbnailUrl: archiveImage2,
  },
  {
    id: 'archive-3',
    title: '계절이 바뀌어도\n내 꿈은 변함없다',
    date: '2029-11-23',
    photoCount: 12,
    authorName: '지현',
    thumbnailUrl: archiveImage3,
  },
];
