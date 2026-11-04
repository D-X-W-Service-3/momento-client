import { Fragment } from 'react';

import { textStyles } from '@/styles/tokens';
import type { ActivitySummaryStats } from '@/types/mypage';

interface ActivitySummarySectionProps {
  stats: ActivitySummaryStats;
}

export default function ActivitySummarySection({
  stats,
}: ActivitySummarySectionProps) {
  const items = [
    { label: '전체캡슐', count: stats.totalCapsules },
    { label: '공개 전', count: stats.beforeOpenCount },
    { label: '공개 됨', count: stats.openedCount },
  ];

  return (
    <section className="flex w-full flex-col gap-[14px]">
      <h2 className={`text-text-heading ${textStyles['section-title']}`}>
        활동 요약
      </h2>

      <div className="bg-surface-white flex h-[75px] w-full items-center justify-center gap-3 rounded-lg px-3 py-5">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 && (
              <div
                className="bg-border-subtle h-[35px] w-px shrink-0"
                aria-hidden="true"
              />
            )}
            <div className="flex w-[93px] flex-col items-center justify-center gap-2 text-center">
              <strong className={`text-text-dark ${textStyles['stat-count']}`}>
                {item.count}
              </strong>
              <span className={`text-text-meta ${textStyles['stat-label']}`}>
                {item.label}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
