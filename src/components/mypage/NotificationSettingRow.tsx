import ToggleSwitch from '@/components/mypage/ToggleSwitch';
import { textStyles } from '@/styles/tokens';
import type {
  NotificationSettingItem,
  NotificationSettingKey,
} from '@/types/mypage';

interface NotificationSettingRowProps {
  item: NotificationSettingItem;
  onToggle: (key: NotificationSettingKey) => void;
}

export default function NotificationSettingRow({
  item,
  onToggle,
}: NotificationSettingRowProps) {
  return (
    <div className="rounded-card bg-surface-white flex h-[58px] w-full items-center justify-between gap-8 px-[14px] py-[13px]">
      <div className="flex flex-col gap-1">
        <strong
          className={`text-text-notif-title ${textStyles['notif-row-title']}`}
        >
          {item.title}
        </strong>
        <span className={`text-text-notif-sub ${textStyles['footnote-tight']}`}>
          {item.description}
        </span>
      </div>

      <ToggleSwitch
        checked={item.enabled}
        onToggle={() => onToggle(item.key)}
        label={item.title}
      />
    </div>
  );
}
