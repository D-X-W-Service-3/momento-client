import { textStyles } from '@/styles/tokens';
import type { NotificationItem } from '@/types/notification';

interface NotificationCardProps {
  item: NotificationItem;
}

export default function NotificationCard({ item }: NotificationCardProps) {
  return (
    <article className="bg-surface-white flex min-h-[75px] w-full items-center gap-3 rounded-xl px-5 py-[15px]">
      <div
        className="bg-surface-white rounded-icon h-[45px] w-[45px] shrink-0 border border-gray-300"
        aria-hidden="true"
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
    </article>
  );
}
