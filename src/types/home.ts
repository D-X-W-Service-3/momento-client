import type { CapsuleCardResponse } from '@/types/capsule';
export interface HeroCapsuleInfo {
  id: number;
  openAt: string;
  tag: string;
  title: string;
  dDay: string;
  releaseDate: string;
  remainingTime: string;
  remainingSuffix: string;
}
export interface HomeCapsuleItem {
  id: number;
  stateLabel: string;
  title: string;
  openDateLabel: string;
  dDayBadge: string;
  meta: string;
}
export interface AttendanceDay {
  day: string;
  checked: boolean;
}
export interface HomeResponse {
  nickname: string;
  hasUnreadNotification: boolean;
  upcomingCapsule: {
    capsuleId: number;
    title: string;
    openAt: string;
    dDay: number;
  } | null;
  capsules: CapsuleCardResponse[];
  weeklyVisit: { days: { date: string; visited: boolean }[]; streak: number };
}
export interface HomeDashboardData {
  hasUnreadNotification: boolean;
  heroCapsule: HeroCapsuleInfo | null;
  featuredCapsules: HomeCapsuleItem[];
  attendanceDays: AttendanceDay[];
  streakCount: number;
}
