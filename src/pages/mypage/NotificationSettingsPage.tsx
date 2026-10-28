import BackHeader from '@/components/layout/BackHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import NotificationSettingRow from '@/components/mypage/NotificationSettingRow';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { textStyles } from '@/styles/tokens';

export default function NotificationSettingsPage() {
  const { notificationSettings, handleBack, handleToggle } =
    useNotificationSettings();

  return (
    <MobileLayout variant="gray">
      <BackHeader
        title="알림 설정"
        onBack={handleBack}
        className="bg-surface-gray"
      />

      <main className="flex flex-1 flex-col gap-3 p-5">
        <h2
          className={`text-text-notif-title ${textStyles['heading-h3-tight']}`}
        >
          필요한 소식만 편하게 받아보세요
        </h2>

        <div className="flex w-full flex-col gap-2">
          {notificationSettings.map((item) => (
            <NotificationSettingRow
              key={item.key}
              item={item}
              onToggle={handleToggle}
            />
          ))}
        </div>

        <p className={`text-text-notif-sub ${textStyles['footnote-tight']}`}>
          기기 설정에서 알림 권한이 꺼져 있으면 앱 알림을 받을 수 없어요.
        </p>
      </main>
    </MobileLayout>
  );
}
