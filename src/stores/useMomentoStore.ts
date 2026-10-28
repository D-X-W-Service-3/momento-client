import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  archives as initialArchives,
  capsules as initialCapsules,
} from '@/constants/mockData';
import type { AnniversaryForm, Archive, Capsule } from '@/types/momento';
import { parseKoreanDate } from '@/utils/dates';

export type Anniversary = AnniversaryForm & { id: number };

const initialAnniversaries: Anniversary[] = [
  {
    id: 1,
    name: '100일 기념',
    date: '2026년 8월 12일',
    yearly: true,
    memo: '우리의 소중한 100일',
    notification: true,
    notificationTime: '오전 9:00',
    reminder: '1일 전',
  },
  {
    id: 2,
    name: '친구 생일',
    date: '2026년 8월 12일',
    yearly: true,
    memo: '',
    notification: true,
    notificationTime: '오전 9:00',
    reminder: '1일 전',
  },
];

type State = {
  archives: Archive[];
  anniversaries: Anniversary[];
  capsules: Capsule[];
  sharedSaved: boolean;
  addArchive: (value: Omit<Archive, 'id' | 'year'>) => number;
  updateArchive: (id: number, value: Partial<Archive>) => void;
  deleteArchive: (id: number) => void;
  saveShared: () => void;
  addAnniversary: (value: AnniversaryForm) => number;
  updateAnniversary: (id: number, value: AnniversaryForm) => void;
  deleteAnniversary: (id: number) => void;
  addCapsule: (value: Omit<Capsule, 'id'>) => number;
  updateCapsule: (id: number, value: Partial<Capsule>) => void;
  deleteCapsule: (id: number) => void;
};

export const useMomentoStore = create<State>()(
  persist(
    (set, get) => ({
      archives: initialArchives,
      anniversaries: initialAnniversaries,
      capsules: initialCapsules,
      sharedSaved: false,
      addArchive: (value) => {
        const id = Math.max(0, ...get().archives.map((item) => item.id)) + 1;
        set((state) => ({
          archives: [
            {
              ...value,
              id,
              year:
                parseKoreanDate(value.date)?.getFullYear() ??
                new Date().getFullYear(),
            },
            ...state.archives,
          ],
        }));
        return id;
      },
      updateArchive: (id, value) =>
        set((state) => ({
          archives: state.archives.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...value,
                  year: value.date
                    ? (parseKoreanDate(value.date)?.getFullYear() ?? item.year)
                    : item.year,
                }
              : item,
          ),
        })),
      deleteArchive: (id) =>
        set((state) => ({
          archives: state.archives.filter((item) => item.id !== id),
        })),
      saveShared: () =>
        set((state) =>
          state.sharedSaved
            ? state
            : {
                sharedSaved: true,
                archives: [
                  {
                    id:
                      Math.max(0, ...state.archives.map((item) => item.id)) + 1,
                    title: '2024 우리, 다시 만나는 날',
                    date: '2027년 3월 1일',
                    year: 2027,
                    author: '유빈',
                    content:
                      '오늘 친구들과 함께 카페에서 오랜만에 만나서 정말 즐거운 시간을 보냈어. 웃음이 끊이지 않고, 서로의 근황도 나누면서 행복한 하루였어.',
                    images: [
                      '/assets/archive/detail-1.jpg',
                      '/assets/archive/memory-04.jpg',
                      '/assets/archive/memory-03.jpg',
                      '/assets/archive/memory-06.jpg',
                      '/assets/archive/memory-01.jpg',
                    ],
                  },
                  ...state.archives,
                ],
              },
        ),
      addAnniversary: (value) => {
        const id =
          Math.max(0, ...get().anniversaries.map((item) => item.id)) + 1;
        set((state) => ({
          anniversaries: [{ ...value, id }, ...state.anniversaries],
        }));
        return id;
      },
      updateAnniversary: (id, value) =>
        set((state) => ({
          anniversaries: state.anniversaries.map((item) =>
            item.id === id ? { ...value, id } : item,
          ),
        })),
      deleteAnniversary: (id) =>
        set((state) => ({
          anniversaries: state.anniversaries.filter((item) => item.id !== id),
        })),
      addCapsule: (value) => {
        const id = Math.max(0, ...get().capsules.map((item) => item.id)) + 1;
        set((state) => ({ capsules: [{ ...value, id }, ...state.capsules] }));
        return id;
      },
      updateCapsule: (id, value) =>
        set((state) => ({
          capsules: state.capsules.map((item) =>
            item.id === id ? { ...item, ...value, id } : item,
          ),
        })),
      deleteCapsule: (id) =>
        set((state) => ({
          capsules: state.capsules.filter((item) => item.id !== id),
        })),
    }),
    { name: 'momento-local-data' },
  ),
);
