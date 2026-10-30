import ChevronRightSmIcon from '@/assets/icons/chevron-right-sm.svg?react';
import { textStyles } from '@/styles/tokens';
import type { HomeCapsuleItem } from '@/types/home';

interface HomeCapsuleSectionProps {
  capsule: HomeCapsuleItem;
  onViewAll?: () => void;
}

export default function HomeCapsuleSection({
  capsule,
  onViewAll,
}: HomeCapsuleSectionProps) {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex h-6 w-full items-center justify-between">
        <h2 className={`text-text-primary ${textStyles['header-title']}`}>
          타임캡슐
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="flex cursor-pointer items-center gap-[5px]"
        >
          <span
            className={`text-text-secondary ${textStyles['body-medium-semi-tight']}`}
          >
            전체보기
          </span>
          <ChevronRightSmIcon className="h-[10px] w-[6px]" />
        </button>
      </div>

      <article className="bg-surface-white flex min-h-[103px] w-full items-center justify-between gap-3 rounded-xl px-5 py-[15px]">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span
            className={`bg-chip-open-bg text-chip-open-text inline-flex h-6 w-fit items-center rounded-full px-[10px] py-1 ${textStyles['body-small-med']}`}
          >
            {capsule.stateLabel}
          </span>

          <div className="flex flex-col gap-1">
            <h3
              className={`text-text-primary truncate ${textStyles['body-large-semi']}`}
            >
              {capsule.title}
            </h3>
            <p className={`text-text-secondary ${textStyles['body-xs']}`}>
              {capsule.openDateLabel}
            </p>
          </div>
        </div>

        <div className="flex h-[73px] shrink-0 flex-col items-end justify-between">
          <span
            className={`bg-primary text-text-on-primary inline-flex h-6 items-center justify-center rounded-full px-[10px] py-1 ${textStyles['body-small-med']}`}
          >
            {capsule.dDayBadge}
          </span>
          <span className={`text-text-muted ${textStyles['body-xs']}`}>
            {capsule.meta}
          </span>
        </div>
      </article>
    </section>
  );
}
