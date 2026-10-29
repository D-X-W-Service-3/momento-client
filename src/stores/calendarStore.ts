import dayjs from 'dayjs';
import { create } from 'zustand';

import type { CalendarFilter } from '@/types/calendar';
import { toDateKey } from '@/utils/date';

interface CalendarState {
  /** 보고 있는 달 (YYYY-MM) */
  viewMonth: string;
  /** 선택한 날짜 (YYYY-MM-DD) */
  selectedDate: string;
  filter: CalendarFilter;
  moveMonth: (offset: number) => void;
  selectDate: (date: string) => void;
  setFilter: (filter: CalendarFilter) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  viewMonth: dayjs().format('YYYY-MM'),
  selectedDate: toDateKey(dayjs()),
  filter: 'all',
  moveMonth: (offset) =>
    set((state) => ({
      viewMonth: dayjs(state.viewMonth).add(offset, 'month').format('YYYY-MM'),
    })),
  selectDate: (date) => set({ selectedDate: date }),
  setFilter: (filter) => set({ filter }),
}));
