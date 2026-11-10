import NotificationCard from '@/components/common/NotificationCard';
import QueryFeedback from '@/components/common/QueryFeedback';
import BackHeader from '@/components/layout/BackHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationPage() {
  const {
    notifications,
    handleBack,
    handleSelect,
    isLoading,
    error,
    retry,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
  } = useNotifications();

  return (
    <MobileLayout variant="gray">
      <BackHeader
        title="알림"
        onBack={handleBack}
        className="bg-surface-gray"
      />

      <main className="flex flex-1 flex-col gap-2 px-5 pb-10">
        <QueryFeedback
          loading={isLoading}
          error={error}
          onRetry={retry}
          empty={notifications.length === 0}
          emptyMessage="새로운 알림이 없어요."
        />
        {notifications.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onClick={() => handleSelect(item)}
          />
        ))}
        {hasNextPage && (
          <button
            type="button"
            disabled={isFetchingNextPage}
            onClick={() => void loadMore()}
            className="text-primary p-3"
          >
            {isFetchingNextPage ? '불러오는 중…' : '더 보기'}
          </button>
        )}
      </main>
    </MobileLayout>
  );
}
