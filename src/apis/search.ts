import { createMockArchives, createMockCapsules } from '@/apis/mocks/memories';
import type { CalendarDayEntry } from '@/types/calendar';

// TODO: 백엔드 API 확정 후 axios 호출로 교체.
export const searchMemories = async (
  keyword: string,
): Promise<CalendarDayEntry> => {
  const query = keyword.trim().replace(/\s+/g, ' ');
  const matches = (title: string) => title.replace(/\s+/g, ' ').includes(query);

  return {
    capsules: createMockCapsules().filter((capsule) => matches(capsule.title)),
    archives: createMockArchives().filter((archive) => matches(archive.title)),
  };
};
