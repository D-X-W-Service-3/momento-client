import { type MouseEvent, type UIEvent, useRef, useState } from 'react';

import CapsuleIcon from '@/components/capsule/CapsuleIcon';
import PaginationDots from '@/components/common/PaginationDots';
import type { CapsuleIconOption } from '@/types/capsule';

const ICON_WIDTH = 101;
const ICON_HEIGHT = 92;

interface CapsuleIconPickerProps {
  icons: CapsuleIconOption[];
  label: string;
  selectedIndex?: number;
  onSelectIndex?: (index: number) => void;
}

/** 가로 스와이프/드래그로 캡슐 아이콘을 고르고, 아래 점으로 위치를 보여준다. */
export default function CapsuleIconPicker({
  icons,
  label,
  selectedIndex,
  onSelectIndex,
}: CapsuleIconPickerProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = selectedIndex ?? internalIndex;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const deltaXRef = useRef(0);

  const updateIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(icons.length - 1, index));
    setInternalIndex(clamped);
    onSelectIndex?.(clamped);
  };

  const scrollToIcon = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(icons.length - 1, index));
    updateIndex(clamped);
    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: 'smooth',
    });
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (isDownRef.current) return;
    const { scrollLeft, clientWidth } = event.currentTarget;
    if (clientWidth === 0) return;
    const next = Math.round(scrollLeft / clientWidth);
    if (next !== activeIndex) {
      updateIndex(next);
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    isDownRef.current = true;
    startXRef.current = event.clientX;
    deltaXRef.current = 0;
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;
    deltaXRef.current = event.clientX - startXRef.current;
  };

  const handleMouseEnd = () => {
    if (!isDownRef.current) return;
    isDownRef.current = false;
    if (deltaXRef.current <= -35 && activeIndex < icons.length - 1) {
      scrollToIcon(activeIndex + 1);
    } else if (deltaXRef.current >= 35 && activeIndex > 0) {
      scrollToIcon(activeIndex - 1);
    }
  };

  return (
    <div className="flex w-full flex-col gap-stack opacity-80">
      <p className="font-display text-field-label font-medium text-field-ink">
        {label}
      </p>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseEnd}
        onMouseLeave={handleMouseEnd}
        className="h-[200px] w-full cursor-grab snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-lg bg-surface select-none [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex h-full">
          {icons.map((icon) => (
            <li
              key={icon.id}
              className="flex h-full w-full shrink-0 snap-center items-center justify-center"
            >
              <CapsuleIcon
                src={icon.imageUrl}
                width={ICON_WIDTH}
                height={ICON_HEIGHT}
              />
            </li>
          ))}
        </ul>
      </div>

      <PaginationDots
        count={icons.length}
        activeIndex={activeIndex}
        onSelect={scrollToIcon}
        ariaLabel="아이콘 선택"
      />
    </div>
  );
}
