import type { CapsuleHomeData, CapsuleListData } from '@/types/capsule';

export const mockCapsuleHomeData: CapsuleHomeData = {
  hasPendingRequest: true,
  featuredCapsules: [
    {
      id: 'featured-1',
      statusLabel: '지금 열 수 있어요',
      dDayText: 'D-DAY',
      title: '2024 우리, 다시 만나는 날',
      description:
        '1년 동안 서로에게 응원과 사랑을 보냈던 우리의 소중한 타임캡슐',
      countText: '편지 3',
      openDateText: '2027. 12. 12 개봉',
    },
    {
      id: 'featured-2',
      statusLabel: '지금 열 수 있어요',
      dDayText: 'D-1',
      title: '스무 살의 나에게 보내는 편지',
      description: '설레는 마음으로 적어 내려갔던 우리의 첫 번째 타임캡슐',
      countText: '편지 5',
      openDateText: '2027. 12. 13 개봉',
    },
    {
      id: 'featured-3',
      statusLabel: '곧 열려요',
      dDayText: 'D-3',
      title: '제주도 가족 여행의 기록',
      description: '푸른 바다 앞에서 약속했던 우리의 다짐을 담은 타임캡슐',
      countText: '편지 4',
      openDateText: '2027. 12. 15 개봉',
    },
    {
      id: 'featured-4',
      statusLabel: '곧 열려요',
      dDayText: 'D-7',
      title: '2025 연말 모임 타임캡슐',
      description: '함께 웃고 떠들던 따뜻한 겨울밤의 추억을 담은 타임캡슐',
      countText: '편지 6',
      openDateText: '2027. 12. 19 개봉',
    },
  ],
  editableCapsules: [
    {
      id: 'edit-1',
      badge: { label: '수정마감 D-12', tone: 'editable' },
      title: '2024 우리, 다시 만나는 날',
      openDateText: '2027.04.15 공개',
    },
    {
      id: 'edit-2',
      badge: { label: '수정마감 D-12', tone: 'editable' },
      title: '2024 우리, 다시 만나는 날',
      openDateText: '2027.04.15 공개',
    },
    {
      id: 'edit-3',
      badge: { label: '수정마감 D-5', tone: 'editable' },
      title: '바니바니 바니바니 당근 당근',
      openDateText: '2027.06.20 공개',
    },
  ],
  lockedCapsules: [
    {
      id: 'lock-1',
      badge: { label: 'D-12', tone: 'locked' },
      title: '2024 우리, 다시 만나는 날',
      openDateText: '2027.04.15 공개',
    },
    {
      id: 'lock-2',
      badge: { label: 'D-12', tone: 'locked' },
      title: '2024 우리, 다시 만나는 날',
      openDateText: '2027.04.15 공개',
    },
    {
      id: 'lock-3',
      badge: { label: 'D-30', tone: 'locked' },
      title: '우리들의 여름방학 이야기',
      openDateText: '2027.08.01 공개',
    },
  ],
  openedCapsules: [
    {
      id: 'open-1',
      badge: { label: 'D+12', tone: 'opened' },
      title: '2024 우리, 다시 만나는 날',
      openDateText: '2027.04.15 공개',
    },
    {
      id: 'open-2',
      badge: { label: 'D+12', tone: 'opened' },
      title: '2024 우리, 다시 만나는 날',
      openDateText: '2027.04.15 공개',
    },
    {
      id: 'open-3',
      badge: { label: 'D+30', tone: 'opened' },
      title: '바니바니 바니바니 당근 당근',
      openDateText: '2027.03.10 공개',
    },
  ],
};

export const mockCapsuleListData: CapsuleListData = {
  filters: [
    { key: 'all', label: '전체', count: 32 },
    { key: 'openable', label: '개봉가능', count: 8 },
    { key: 'editable', label: '수정 가능', count: 24 },
    { key: 'locked', label: '잠긴 캡슐', count: 24 },
    { key: 'opened', label: '열린 캡슐', count: 1 },
  ],
  items: [
    {
      id: 'list-2026-1',
      year: 2026,
      filterCategory: 'openable',
      variant: 'gradient',
      badges: [{ label: '개봉 가능', tone: 'openable' }],
      title: '2024 우리, 다시 만나는 날',
      description:
        '1년 동안 서로에게 응원과 사랑을 보냈던 우리의 소중한 타임캡슐',
      dDayText: 'D-DAY',
      dateText: '2027. 12. 12 개봉',
      countText: '5명 | 편지 3',
    },
    {
      id: 'list-2026-2',
      year: 2026,
      filterCategory: 'editable',
      variant: 'translucent',
      badges: [{ label: '수정마감 D-12', tone: 'editable' }],
      title: '바니바니 바니바니 당근 당근',
      description: '제주도에서의 추억을 담아 만든 타임캡슐 🥕',
      dateText: '3일 후 봉인 예정',
      countText: '5명 | 편지 3',
    },
    {
      id: 'list-2027-1',
      year: 2027,
      filterCategory: 'locked',
      variant: 'white',
      badges: [
        { label: '봉인됨', tone: 'locked' },
        { label: 'D-30', tone: 'locked' },
      ],
      title: '2024 우리, 다시 만나는 날',
      description:
        '1년 동안 서로에게 응원과 사랑을 보냈던 우리의 소중한 타임캡슐',
      dateText: '2027. 12. 12 개봉',
      countText: '5명 | 편지 3',
    },
    {
      id: 'list-2027-2',
      year: 2027,
      filterCategory: 'editable',
      variant: 'translucent',
      badges: [{ label: '수정마감 D-12', tone: 'editable' }],
      title: '바니바니 바니바니 당근 당근',
      description: '제주도에서의 추억을 담아 만든 타임캡슐 🥕',
      dateText: '3일 후 봉인 예정',
      countText: '5명 | 편지 3',
    },
    {
      id: 'list-2027-3',
      year: 2027,
      filterCategory: 'opened',
      variant: 'translucent',
      badges: [
        { label: '개봉됨', tone: 'opened' },
        { label: 'D+30', tone: 'opened' },
      ],
      title: '바니바니 바니바니 당근 당근',
      description: '제주도에서의 추억을 담아 만든 타임캡슐 🥕',
      dateText: '2027. 12. 12 개봉',
      countText: '5명 | 편지 3',
    },
  ],
};

export async function fetchCapsuleHomeData(): Promise<CapsuleHomeData> {
  return mockCapsuleHomeData;
}

export async function fetchCapsuleListData(): Promise<CapsuleListData> {
  return mockCapsuleListData;
}
