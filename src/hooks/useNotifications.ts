import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markNotificationRead } from '@/apis/notifications';
import { notificationDestination } from '@/utils/notificationDestination';
import type {
  NotificationItem,
  NotificationPageResponse,
} from '@/types/notification';

export function useNotifications() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const query = useInfiniteQuery({
    queryKey: ['notifications'],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => fetchNotifications(pageParam),
    getNextPageParam: (page) =>
      page.hasNext && page.nextCursor ? page.nextCursor : undefined,
  });
  const read = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (_data, id) => {
      client.setQueryData<InfiniteData<NotificationPageResponse>>(
        ['notifications'],
        (data) => {
          if (!data) return data;
          const wasUnread = data.pages.some((page) =>
            page.notifications.some(
              (item) => String(item.notificationId) === id && !item.isRead,
            ),
          );
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              unreadCount: Math.max(0, page.unreadCount - (wasUnread ? 1 : 0)),
              notifications: page.notifications.map((item) =>
                String(item.notificationId) === id
                  ? { ...item, isRead: true }
                  : item,
              ),
            })),
          };
        },
      );
      void client.invalidateQueries({ queryKey: ['homeDashboard'] });
    },
  });
  const seen = new Set<number>();
  const notifications: NotificationItem[] = (
    query.data?.pages.flatMap((page) => page.notifications) ?? []
  )
    .filter((item) => {
      if (seen.has(item.notificationId)) return false;
      seen.add(item.notificationId);
      return true;
    })
    .map((item) => ({
      id: String(item.notificationId),
      title: item.title,
      description: item.content,
      dateLabel: item.createdAt.slice(0, 10).replace(/-/g, '.'),
      isRead: item.isRead,
      type: item.type,
      referenceId: item.referenceId,
    }));
  return {
    notifications,
    isLoading: query.isLoading,
    error: query.error ?? read.error,
    retry: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    loadMore: () => query.fetchNextPage(),
    handleBack: () => navigate(-1),
    handleSelect: (item: NotificationItem) => {
      if (read.isPending) return;
      const go = () => {
        const path = notificationDestination(item);
        if (path) navigate(path);
      };
      if (item.isRead) go();
      else read.mutate(item.id, { onSuccess: go });
    },
  };
}
