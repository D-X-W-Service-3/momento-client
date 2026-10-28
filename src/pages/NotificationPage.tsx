import NotificationCard from '@/components/common/NotificationCard';
import BackHeader from '@/components/layout/BackHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationPage() {
  const { notifications, handleBack } = useNotifications();

  return (
    <MobileLayout variant="gray">
      <BackHeader title="알림" onBack={handleBack} />

      <main className="flex flex-1 flex-col gap-2 px-5 pb-10">
        {notifications.map((item) => (
          <NotificationCard key={item.id} item={item} />
        ))}
      </main>
    </MobileLayout>
  );
}
