import ToggleSwitch from '@/components/mypage/ToggleSwitch';
import type { PushStatus } from '@/hooks/usePushNotification';
import { textStyles } from '@/styles/tokens';

interface PushNotificationRowProps {
  status: PushStatus;
  disabled?: boolean;
  onToggle: () => void;
}

const descriptions: Record<PushStatus, string> = {
  loading: '알림 상태를 확인하고 있어요',
  on: '이 기기로 알림을 보내드려요',
  off: '켜면 이 기기로 알림을 받을 수 있어요',
  denied: '기기 설정에서 Momento 알림을 허용해 주세요',
  'ios-needs-install': '홈 화면에 추가한 앱에서 받을 수 있어요',
  unsupported: '이 브라우저에서는 푸시 알림을 받을 수 없어요',
};

/** 기기 푸시 알림 on/off. 아래 알림 종류별 설정과 별개로 이 기기의 수신 여부를 정한다. */
export default function PushNotificationRow({
  status,
  disabled,
  onToggle,
}: PushNotificationRowProps) {
  const togglable = status === 'on' || status === 'off';

  return (
    <div className="rounded-card bg-surface-white flex h-[58px] w-full items-center justify-between gap-8 px-[14px] py-[13px]">
      <div className="flex flex-col gap-1">
        <strong
          className={`text-text-notif-title ${textStyles['notif-row-title']}`}
        >
          푸시 알림
        </strong>
        <span className={`text-text-notif-sub ${textStyles['footnote-tight']}`}>
          {descriptions[status]}
        </span>
      </div>

      {togglable && (
        <ToggleSwitch
          checked={status === 'on'}
          disabled={disabled}
          onToggle={onToggle}
          label="푸시 알림"
        />
      )}
    </div>
  );
}
