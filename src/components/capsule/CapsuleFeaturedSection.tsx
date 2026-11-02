import { type MouseEvent, useRef } from 'react';

import ChevronRightSmIcon from '@/assets/icons/chevron-right-sm.svg?react';
import capsuleFeaturedBgImg from '@/assets/images/capsule-featured-bg.png';
import { textStyles } from '@/styles/tokens';
import type { CapsuleFeaturedItem } from '@/types/capsule';

interface CapsuleFeaturedSectionProps {
  capsules: CapsuleFeaturedItem[];
  activeSlide: number;
  onSelectSlide: (index: number) => void;
  onViewAll: () => void;
  onSelectCapsule: (id: string) => void;
}

export default function CapsuleFeaturedSection({
  capsules,
  activeSlide,
  onSelectSlide,
  onViewAll,
  onSelectCapsule,
}: CapsuleFeaturedSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const deltaXRef = useRef(0);

  const scrollToSlide = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(capsules.length - 1, index));
    onSelectSlide(clamped);
    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || isDownRef.current || el.clientWidth === 0) return;
    const nextIndex = Math.round(el.scrollLeft / el.clientWidth);
    if (
      nextIndex >= 0 &&
      nextIndex < capsules.length &&
      nextIndex !== activeSlide
    ) {
      onSelectSlide(nextIndex);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDownRef.current = true;
    startXRef.current = e.clientX;
    deltaXRef.current = 0;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;
    deltaXRef.current = e.clientX - startXRef.current;
  };

  const handleMouseEnd = () => {
    if (!isDownRef.current) return;
    isDownRef.current = false;
    if (deltaXRef.current <= -40 && activeSlide < capsules.length - 1) {
      scrollToSlide(activeSlide + 1);
    } else if (deltaXRef.current >= 40 && activeSlide > 0) {
      scrollToSlide(activeSlide - 1);
    }
  };

  const handleCardClick = (capsuleId: string) => {
    if (Math.abs(deltaXRef.current) > 10) {
      deltaXRef.current = 0;
      return;
    }
    onSelectCapsule(capsuleId);
  };

  return (
    <section className="flex w-full flex-col items-center gap-3">
      <div className="flex h-6 w-full items-center justify-between">
        <h2 className={`text-text-primary ${textStyles['header-title']}`}>
          곧 만날 타임캡슐
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
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseEnd}
        onMouseLeave={handleMouseEnd}
        className="flex w-full cursor-grab snap-x snap-mandatory overflow-x-auto rounded-xl select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {capsules.map((capsule) => (
          <article
            key={capsule.id}
            onClick={() => handleCardClick(capsule.id)}
            className="relative flex h-[343px] w-full shrink-0 snap-center flex-col justify-between overflow-hidden rounded-xl p-5 shadow-[0_2px_8px_rgb(26_23_22/0.05)]"
          >
            <img
              src={capsuleFeaturedBgImg}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />

            <div className="relative z-10 flex w-full items-center justify-between">
              <span
                className={`border-surface-white/60 bg-surface-white/15 text-text-on-primary inline-flex h-[30px] items-center justify-center rounded-full border px-3 backdrop-blur-xs ${textStyles['body-small-med']}`}
              >
                {capsule.statusLabel}
              </span>

              <strong
                className={`text-text-on-primary pl-3 ${textStyles['heading-h2']}`}
              >
                {capsule.dDayText}
              </strong>
            </div>

            <div className="relative z-10 flex w-full flex-col gap-2 text-left">
              <h3
                className={`text-text-on-primary ${textStyles['heading-h2']}`}
              >
                {capsule.title}
              </h3>

              <div className="flex w-full items-end justify-between gap-3">
                <p
                  className={`text-text-on-primary/90 line-clamp-2 max-w-[197px] ${textStyles['body-xs']}`}
                >
                  {capsule.description}
                </p>

                <div className="flex shrink-0 flex-col items-end">
                  <span
                    className={`text-text-on-primary/90 ${textStyles['body-xs']}`}
                  >
                    {capsule.countText}
                  </span>
                  <span
                    className={`text-text-on-primary/90 ${textStyles['body-xs']}`}
                  >
                    {capsule.openDateText}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        className="flex items-center gap-2"
        role="tablist"
        aria-label="타임캡슐 슬라이드"
      >
        {capsules.map((capsule, idx) => {
          const isActive = idx === activeSlide;
          return (
            <button
              key={capsule.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${idx + 1}번째 슬라이드`}
              onClick={() => scrollToSlide(idx)}
              className={`h-[6px] cursor-pointer rounded-full transition-all ${
                isActive ? 'bg-primary w-4' : 'bg-border-default w-[6px]'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
