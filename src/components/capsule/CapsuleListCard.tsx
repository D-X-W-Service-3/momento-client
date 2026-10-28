import capsulePopsicleImg from '@/assets/images/home-capsule-popsicle.png';
import CapsuleStateChip from '@/components/capsule/CapsuleStateChip';
import { textStyles } from '@/styles/tokens';
import type { CapsuleListItem } from '@/types/capsule';

interface CapsuleListCardProps {
  item: CapsuleListItem;
}

export default function CapsuleListCard({ item }: CapsuleListCardProps) {
  const isGradient = item.variant === 'gradient';
  const cardBgClass = isGradient
    ? 'capsule-openable-card'
    : item.variant === 'translucent'
      ? 'bg-surface-white/90 shadow-[0_2px_8px_rgb(26_23_22/0.05)]'
      : 'bg-surface-white shadow-[0_2px_8px_rgb(26_23_22/0.05)]';

  const titleColorClass = isGradient
    ? 'text-text-on-primary'
    : 'text-text-primary';

  return (
    <article
      className={`flex w-full flex-col gap-3 rounded-xl p-5 ${cardBgClass}`}
    >
      <div className="flex w-full items-end justify-between gap-3">
        <div className="flex w-[197px] flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            {item.badges.map((badge) => (
              <CapsuleStateChip key={badge.label} badge={badge} />
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <h3
              className={`truncate ${titleColorClass} ${textStyles['body-large-semi']}`}
            >
              {item.title}
            </h3>
            <p
              className={`line-clamp-2 ${titleColorClass} ${textStyles['body-medium']}`}
            >
              {item.description}
            </p>
          </div>
        </div>

        <div className="flex h-[99px] w-[104px] shrink-0 items-end justify-end">
          <img
            src={capsulePopsicleImg}
            alt=""
            className="h-[95px] w-[104px] object-contain"
          />
        </div>
      </div>

      {isGradient ? (
        <div className="flex w-full items-center justify-between">
          <strong
            className={`text-text-on-primary ${textStyles['heading-h2']}`}
          >
            {item.dDayText ?? 'D-DAY'}
          </strong>
          <div className="flex flex-col items-end">
            <span className={`text-text-on-primary ${textStyles['body-xs']}`}>
              {item.countText}
            </span>
            <span className={`text-text-on-primary ${textStyles['body-xs']}`}>
              {item.dateText}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between">
          <span className={`text-text-secondary ${textStyles['body-xs']}`}>
            {item.dateText}
          </span>
          <span className={`text-text-placeholder ${textStyles['body-xs']}`}>
            {item.countText}
          </span>
        </div>
      )}
    </article>
  );
}
