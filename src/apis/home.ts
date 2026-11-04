import { api } from '@/apis/client';
import type { HomeDashboardData, HomeResponse } from '@/types/home';
import {
  capsuleBadge,
  capsuleCountLabel,
  capsuleDateLabel,
  dDayLabel,
  serverDate,
} from '@/utils/capsuleCards';

export function remainingUntil(openAt: string, now = Date.now()) {
  const seconds = Math.max(
    0,
    Math.floor((serverDate(openAt).getTime() - now) / 1000),
  );
  return [
    Math.floor((seconds % 86400) / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
}
export async function fetchHomeDashboard(): Promise<HomeDashboardData> {
  const data = await api.get<HomeResponse>('/v1/home');
  const upcoming = data.upcomingCapsule;
  return {
    hasUnreadNotification: data.hasUnreadNotification,
    heroCapsule: upcoming
      ? {
          id: upcoming.capsuleId,
          openAt: upcoming.openAt,
          tag: '가장 먼저 열리는 캡슐',
          title: upcoming.title,
          dDay: dDayLabel(upcoming.dDay),
          releaseDate: capsuleDateLabel(upcoming.openAt),
          remainingTime: remainingUntil(upcoming.openAt),
          remainingSuffix: '이후 열어 볼 수 있어요',
        }
      : null,
    featuredCapsules: data.capsules.map((card) => ({
      id: card.capsuleId,
      stateLabel: capsuleBadge(card).label,
      title: card.title,
      openDateLabel: capsuleDateLabel(card.openAt),
      dDayBadge: dDayLabel(card.dDay),
      meta: capsuleCountLabel(card),
    })),
    attendanceDays: data.weeklyVisit.days.map((day, index) => ({
      day: ['월', '화', '수', '목', '금', '토', '일'][index],
      checked: day.visited,
    })),
    streakCount: data.weeklyVisit.streak,
  };
}
