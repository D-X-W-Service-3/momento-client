import CapsuleStateChip from '@/components/common/CapsuleStateChip';
import DDayBadge from '@/components/common/DDayBadge';
import type { CapsuleSummary } from '@/types/calendar';
import { formatKoreanDate, getDDay } from '@/utils/date';

interface CapsuleCardProps {
  capsule: CapsuleSummary;
}

export default function CapsuleCard({ capsule }: CapsuleCardProps) {
  return (
    <article className="flex w-full gap-list rounded-lg bg-surface px-5 py-[15px] shadow-card">
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-stack">
        <CapsuleStateChip status={capsule.status} />
        <div className="flex w-full flex-col gap-1">
          <h3 className="truncate text-button font-semibold text-black">
            {capsule.title}
          </h3>
          <p className="text-caption text-ink-muted">
            {formatKoreanDate(capsule.openDate)} 개봉
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end justify-between">
        <DDayBadge dDay={getDDay(capsule.openDate)} />
        <p className="text-caption whitespace-nowrap text-ink-faint">
          {capsule.memberCount}명 | 편지 {capsule.letterCount}
        </p>
      </div>
    </article>
  );
}
