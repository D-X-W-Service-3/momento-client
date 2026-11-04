export interface NotificationResponse {
  notificationId: number;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  referenceId: number | null;
}
export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  isRead: boolean;
  type: string;
  referenceId: number | null;
}
export interface NotificationPageResponse {
  unreadCount: number;
  notifications: NotificationResponse[];
  nextCursor: string | null;
  hasNext: boolean;
}
