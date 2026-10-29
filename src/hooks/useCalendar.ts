import { useQuery } from '@tanstack/react-query';

import { getCalendarCounts, getCalendarEntries } from '@/apis/calendar';

/** month: YYYY-MM */
export const useCalendarEntries = (month: string) =>
  useQuery({
    queryKey: ['calendar', 'entries', month],
    queryFn: () => getCalendarEntries(month),
  });

export const useCalendarCounts = () =>
  useQuery({
    queryKey: ['calendar', 'counts'],
    queryFn: getCalendarCounts,
  });
