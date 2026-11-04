import ChevronRightSmIcon from '@/assets/icons/chevron-right-sm.svg?react';
import capsulePopsicleImg from '@/assets/images/home-capsule-popsicle.png';
import Chip from '@/components/common/Chip';
import { useHorizontalDragScroll } from '@/hooks/useHorizontalDragScroll';
import { textStyles } from '@/styles/tokens';
import type { CapsuleHorizontalItem } from '@/types/capsule';

interface CapsuleHorizontalSectionProps {
  title: string;
  emptyDescription: string;
  items: CapsuleHorizontalItem[];
  onViewAll: () => void;
  onSelectCapsule: (id: string) => void;
}

export default function CapsuleHorizontalSection({
  title,
  emptyDescription,
  items,
  onViewAll,
  onSelectCapsule,
}: CapsuleHorizontalSectionProps) {
  const { containerRef, dragProps } = useHorizontalDragScroll<HTMLDivElement>();

  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex h-6 w-full items-center justify-between">
        <h2 className={`text-text-primary ${textStyles['header-title']}`}>
          {title}
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

      <div
        ref={containerRef}
        {...dragProps}
        className={`${items.length <= 1 ? 'w-full' : '-mr-5 pr-5'} flex cursor-grab touch-pan-x gap-3 overflow-x-auto select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden`}
      >
        {items.length === 0 && (
          <div className="bg-surface-white flex h-[126px] w-full shrink-0 items-center justify-between gap-3 rounded-xl px-5 py-[15px] shadow-[0_2px_8px_rgb(26_23_22/0.05)]">
            <div className="flex w-[132px] flex-col gap-1">
              <h3
                className={`text-text-primary ${textStyles['body-large-semi']}`}
              >
                아직 캡슐이 없어요
              </h3>
              <p className={`text-text-secondary ${textStyles['body-xs']}`}>
                {emptyDescription}
              </p>
            </div>
            <img
              src={capsulePopsicleImg}
              alt=""
              aria-hidden="true"
              className="pointer-events-none h-[70px] w-[76px] shrink-0 object-contain"
            />
          </div>
        )}
        {items.map((item) => (
          <article
            key={item.id}
            onClick={() => onSelectCapsule(item.id)}
            className={`bg-surface-white flex h-[126px] ${items.length === 1 ? 'w-full' : 'w-[260px]'} shrink-0 cursor-pointer items-center justify-between gap-3 rounded-xl px-5 py-[15px] shadow-[0_2px_8px_rgb(26_23_22/0.05)]`}
          >
            <div className="flex w-[132px] flex-col gap-3">
              <Chip tone={item.badge.tone}>{item.badge.label}</Chip>
              <div className="flex flex-col gap-1">
                <h3
                  className={`line-clamp-2 text-black ${textStyles['body-large-semi']}`}
                >
                  {item.title}
                </h3>
                <p className={`text-text-secondary ${textStyles['body-xs']}`}>
                  {item.openDateText}
                </p>
              </div>
            </div>

            <img
              src={capsulePopsicleImg}
              alt=""
              draggable={false}
              className="pointer-events-none h-[70px] w-[76px] shrink-0 object-contain"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
