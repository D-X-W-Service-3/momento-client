import { api } from '@/apis/client';
import type { NotificationPageResponse } from '@/types/notification';
export const fetchNotifications = (cursor?: string) =>
  api.get<NotificationPageResponse>(
    `/v1/notifications${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
  );
export const markNotificationRead = (id: string) =>
  api.patch<void>(`/v1/notifications/${encodeURIComponent(id)}/read`);
