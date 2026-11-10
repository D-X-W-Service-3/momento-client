import { textStyles } from '@/styles/tokens';
import type { NotificationItem } from '@/types/notification';

interface NotificationCardProps {
  item: NotificationItem;
  onClick?: () => void;
}

export default function NotificationCard({
  item,
  onClick,
}: NotificationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-surface-white flex min-h-[75px] w-full items-center gap-3 rounded-xl px-5 py-[15px] text-left"
    >
      {/* 읽지 않은 알림만 점으로 표시한다 */}
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.isRead ? '' : 'bg-primary'}`}
        aria-label={item.isRead ? undefined : '읽지 않음'}
        aria-hidden={item.isRead || undefined}
      />
      <div className="flex min-h-[45px] min-w-0 flex-1 flex-col justify-center">
        <h2
          className={`text-text-primary truncate ${textStyles['body-medium-semi']}`}
        >
          {item.title}
        </h2>
        <p
          className={`text-text-secondary truncate ${textStyles['caption-default']}`}
        >
          {item.description}
        </p>
      </div>
      <div className="flex h-[45px] shrink-0 flex-col items-end justify-end">
        <span className={`text-text-muted ${textStyles['body-xs']}`}>
          {item.dateLabel}
        </span>
      </div>
    </button>
  );
}
