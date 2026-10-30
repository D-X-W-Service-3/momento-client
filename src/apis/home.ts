import type { HomeDashboardData } from '@/types/home';

const MOCK_HOME_DASHBOARD: HomeDashboardData = {
  heroCapsule: {
    tag: '가장 먼저 열리는 캡슐',
    title: '스무 살의 나에게',
    dDay: 'D-365',
    releaseDate: '2026.03.01 공개',
    remainingTime: '03:55:13',
    remainingSuffix: '이후 열어 볼 수 있어요',
  },
  featuredCapsule: {
    id: 1,
    stateLabel: '개봉 가능',
    title: '새로운 시작의 아침',
    openDateLabel: '2027년 4월 15일 개봉',
    dDayBadge: 'D-DAY',
    meta: '5명 | 편지 3',
  },
  attendanceDays: [
    { day: '월', checked: false },
    { day: '화', checked: false },
    { day: '수', checked: false },
    { day: '목', checked: true },
    { day: '금', checked: true },
    { day: '토', checked: true },
    { day: '일', checked: true },
  ],
  streakCount: 4,
};

export async function fetchHomeDashboard(): Promise<HomeDashboardData> {
  return Promise.resolve(MOCK_HOME_DASHBOARD);
}
