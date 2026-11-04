import type { AnniversaryForm } from '@/types/momento';
import { request } from '@/apis/client';
import { validateMemoryImages } from '@/utils/archivePhotos';

export { request } from '@/apis/client';

export const toIsoDate = (date: string) => {
  const match = date.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  return match
    ? `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`
    : date;
};

export const toKoreanDate = (date: string) => {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match
    ? `${match[1]}년 ${Number(match[2])}월 ${Number(match[3])}일`
    : date;
};

export type MemorySummary = {
  memoryId: number;
  title: string;
  memoryDate: string;
  thumbnailUrl: string | null;
  imageCount: number;
  authorNickname: string;
};
export type MemoryDetail = {
  memoryId: number;
  title: string;
  content: string;
  memoryDate: string;
  authorNickname: string;
  isMine: boolean;
  images: { imageKey: string; imageUrl: string }[];
};
export type AnniversaryDetail = {
  anniversaryId: number;
  title: string;
  anniversaryDate: string;
  repeatType: 'NONE' | 'YEARLY';
  memo: string;
  notificationEnabled: boolean;
  notifyTime: string;
  remindDaysBefore: number | null;
};
export type CalendarData = {
  capsules: {
    capsuleId: number;
    title: string;
    openAt: string;
    status: string;
    openedByMe?: boolean;
    dDay: number;
    memberCount: number;
    letterCount: number;
  }[];
  anniversaries: {
    anniversaryId: number;
    title: string;
    date: string;
    dDay: number;
  }[];
  memories: MemorySummary[];
};

export const getMemories = (keyword = '') =>
  request<{
    memories: MemorySummary[];
    hasNext: boolean;
    hasReceivedMemory: boolean;
  }>(`/v1/memories?size=100&keyword=${encodeURIComponent(keyword)}`);
export const getMemory = (id: number) =>
  request<MemoryDetail>(`/v1/memories/${id}`);
export const deleteMemory = (id: number) =>
  request<void>(`/v1/memories/${id}`, { method: 'DELETE' });
export async function uploadMemoryImages(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  validateMemoryImages(files);
  const data = await request<{
    uploads: { imageKey: string; uploadUrl: string }[];
  }>('/v1/images/presigned-urls', {
    method: 'POST',
    body: JSON.stringify({
      target: 'MEMORY',
      files: files.map((file) => ({
        contentType: file.type,
        contentLength: file.size,
      })),
    }),
  });
  if (data.uploads.length !== files.length) {
    throw new Error('사진 업로드 정보를 확인할 수 없어요. 다시 시도해 주세요.');
  }
  await Promise.all(
    data.uploads.map(async (upload, index) => {
      const response = await fetch(upload.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': files[index].type },
        body: files[index],
      });
      if (!response.ok) throw new Error('사진 업로드에 실패했어요.');
    }),
  );
  return data.uploads.map((upload) => upload.imageKey);
}
export type MemoryInput = {
  title: string;
  content: string;
  memoryDate: string;
  imageKeys: string[];
};
export const createMemory = (value: MemoryInput) =>
  request<unknown>('/v1/memories', {
    method: 'POST',
    body: JSON.stringify(value),
  });
export const updateMemory = (id: number, value: MemoryInput) =>
  request<void>(`/v1/memories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(value),
  });
export const shareMemory = (id: number) =>
  request<{ shareToken: string }>(`/v1/memories/${id}/share`, {
    method: 'POST',
  });
export type ReceivedMemory = {
  receivedMemoryId: number;
  title: string;
  content: string;
  memoryDate: string;
  senderNickname: string;
  images: { imageUrl: string }[];
};
export const getReceivedMemories = () =>
  request<{ memories: ReceivedMemory[] }>('/v1/memories/received');
export const receiveMemory = (token: string) =>
  request<void>(`/v1/memories/shared/${encodeURIComponent(token)}`, {
    method: 'POST',
  });
export const saveReceivedMemory = (id: number) =>
  request<void>(`/v1/memories/received/${id}/save`, { method: 'POST' });
export const dismissReceivedMemory = (id: number) =>
  request<void>(`/v1/memories/received/${id}/dismiss`, { method: 'POST' });
export const getCalendarDaily = (date: string) =>
  request<CalendarData>(`/v1/calendar/daily?date=${toIsoDate(date)}`);
export const getCalendarMonth = (year: number, month: number) =>
  request<{
    counts: {
      all: number;
      capsules: number;
      anniversaries: number;
      memories: number;
    };
    days: { date: string; types?: string[] }[];
  }>(`/v1/calendar?year=${year}&month=${month}`);
export const searchCalendar = (
  keyword: string,
  year?: number,
  sort: 'LATEST' | 'OLDEST' = 'LATEST',
) =>
  request<CalendarData>(
    `/v1/calendar/search?keyword=${encodeURIComponent(keyword)}&sort=${sort}${year ? `&year=${year}` : ''}`,
  );
export function toCalendarItems(data: CalendarData) {
  const formatDDay = (days: number) =>
    days === 0 ? 'D-DAY' : days > 0 ? `D-${days}` : `D+${-days}`;
  return [
    ...data.capsules.map((item) => ({
      id: item.capsuleId,
      type: 'capsule' as const,
      title: item.title,
      date: toKoreanDate(item.openAt),
      dDay: formatDDay(item.dDay),
      status:
        item.status === 'WRITING'
          ? ('writing' as const)
          : item.status === 'LOCKED'
            ? ('sealed' as const)
            : item.status === 'OPENED' && item.openedByMe
              ? ('opened' as const)
              : ('open' as const),
      meta: `${item.memberCount}명 | 편지 ${item.letterCount}`,
    })),
    ...data.anniversaries.map((item) => ({
      id: item.anniversaryId,
      type: 'anniversary' as const,
      title: item.title,
      date: toKoreanDate(item.date),
      dDay: formatDDay(item.dDay),
    })),
    ...data.memories.map((item) => ({
      id: item.memoryId,
      type: 'archive' as const,
      title: item.title,
      date: toKoreanDate(item.memoryDate),
      image: item.thumbnailUrl ?? undefined,
      meta: `사진 ${item.imageCount}`,
    })),
  ];
}
export const getAnniversary = (id: number) =>
  request<AnniversaryDetail>(`/v1/anniversaries/${id}`);

function anniversaryPayload(value: AnniversaryForm) {
  const time = value.notificationTime.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
  const hour = time
    ? (Number(time[2]) % 12) + (time[1] === '오후' ? 12 : 0)
    : 9;
  return {
    title: value.name,
    anniversaryDate: toIsoDate(value.date),
    repeatType: value.yearly ? 'YEARLY' : 'NONE',
    memo: value.memo,
    notificationEnabled: value.notification,
    notifyTime: `${String(hour).padStart(2, '0')}:${time?.[3] ?? '00'}`,
    remindDaysBefore: value.notification
      ? Number.parseInt(value.reminder, 10) || null
      : null,
  };
}
export const createAnniversary = (value: AnniversaryForm) =>
  request<{ anniversaryId: number }>('/v1/anniversaries', {
    method: 'POST',
    body: JSON.stringify(anniversaryPayload(value)),
  });
export const updateAnniversary = (id: number, value: AnniversaryForm) =>
  request<void>(`/v1/anniversaries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(anniversaryPayload(value)),
  });
export const deleteAnniversary = (id: number) =>
  request<void>(`/v1/anniversaries/${id}`, { method: 'DELETE' });
