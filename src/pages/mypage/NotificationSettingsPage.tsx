import BackHeader from '@/components/layout/BackHeader';
import QueryFeedback from '@/components/common/QueryFeedback';
import MobileLayout from '@/components/layout/MobileLayout';
import NotificationSettingRow from '@/components/mypage/NotificationSettingRow';
import PushNotificationRow from '@/components/mypage/PushNotificationRow';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { usePushNotification } from '@/hooks/usePushNotification';
import { textStyles } from '@/styles/tokens';

export default function NotificationSettingsPage() {
  const {
    notificationSettings,
    handleBack,
    handleToggle,
    isLoading,
    error,
    retry,
    isSaving,
  } = useNotificationSettings();
  const push = usePushNotification();

  return (
    <MobileLayout variant="gray">
      <BackHeader
        title="알림 설정"
        onBack={handleBack}
        className="bg-surface-gray"
      />

      <main className="flex flex-1 flex-col gap-3 p-5">
        <QueryFeedback loading={isLoading} error={error} onRetry={retry} />
        <h2
          className={`text-text-notif-title ${textStyles['heading-h3-tight']}`}
        >
          필요한 소식만 편하게 받아보세요
        </h2>

        <PushNotificationRow
          status={push.status}
          disabled={push.isPending}
          onToggle={() => void push.toggle()}
        />
        {push.error && (
          <p className={`text-danger ${textStyles['footnote-tight']}`}>
            푸시 알림 설정에 실패했어요. 잠시 후 다시 시도해 주세요.
          </p>
        )}

        <div className="flex w-full flex-col gap-2">
          {notificationSettings.map((item) => (
            <NotificationSettingRow
              key={item.key}
              item={item}
              disabled={isSaving}
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
