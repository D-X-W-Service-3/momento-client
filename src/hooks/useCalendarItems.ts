import { useMemo } from 'react';

import { useMomentoStore } from '@/stores/useMomentoStore';
import type { CalendarItem } from '@/types/momento';
import { daysUntil } from '@/utils/dates';

export function useCalendarItems(): CalendarItem[] {
  const archives = useMomentoStore((state) => state.archives);
  const anniversaries = useMomentoStore((state) => state.anniversaries);
  const capsules = useMomentoStore((state) => state.capsules);
  return useMemo(
    () => [
      ...capsules.map((item) => ({
        ...item,
        type: 'capsule' as const,
        dDay: daysUntil(item.date),
      })),
      ...anniversaries.map((item) => ({
        id: item.id,
        type: 'anniversary' as const,
        title: item.name,
        date: item.date,
        yearly: item.yearly,
        dDay: daysUntil(item.date, item.yearly),
      })),
      ...archives.map((item) => ({
        id: item.id,
        type: 'archive' as const,
        title: item.title,
        date: item.date,
        image: item.images[0],
        meta: `사진 ${item.images.length}`,
      })),
    ],
    [archives, anniversaries, capsules],
  );
}
