export interface HeroCapsuleInfo {
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

export interface HomeDashboardData {
  heroCapsule: HeroCapsuleInfo;
  featuredCapsule: HomeCapsuleItem;
  attendanceDays: AttendanceDay[];
  streakCount: number;
}
