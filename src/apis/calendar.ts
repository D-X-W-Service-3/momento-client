import dayjs from 'dayjs';

import { createMockArchives, createMockCapsules } from '@/apis/mocks/memories';
import type { CalendarCounts, CalendarMonthEntries } from '@/types/calendar';
import { toDateKey } from '@/utils/date';

// TODO: 백엔드 API 확정 후 axios 호출로 교체.
export const getCalendarEntries = async (
  _month: string,
): Promise<CalendarMonthEntries> => {
  const today = dayjs();
  const entry = {
    capsules: createMockCapsules(),
    archives: createMockArchives(),
  };

  return {
    [toDateKey(today.startOf('month'))]: entry,
    [toDateKey(today)]: entry,
  };
};

export const getCalendarCounts = async (): Promise<CalendarCounts> => ({
  all: 25,
  capsule: 324,
  archive: 5251,
});
