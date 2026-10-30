import { useState, type UIEvent } from 'react';

import CapsuleIcon from '@/components/capsule/CapsuleIcon';
import PaginationDots from '@/components/common/PaginationDots';
import type { CapsuleIconOption } from '@/types/capsule';

const ICON_WIDTH = 101;
const ICON_HEIGHT = 92;

interface CapsuleIconPickerProps {
  icons: CapsuleIconOption[];
  label: string;
}

/** 가로 스와이프로 캡슐 아이콘을 고르고, 아래 점으로 위치를 보여준다. */
export default function CapsuleIconPicker({
  icons,
  label,
}: CapsuleIconPickerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth } = event.currentTarget;
    setActiveIndex(Math.round(scrollLeft / clientWidth));
  };

  return (
    <div className="flex w-full flex-col gap-stack opacity-80">
      <p className="font-display text-field-label font-medium text-field-ink">
        {label}
      </p>

      <div
        onScroll={handleScroll}
        className="h-[200px] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-lg bg-surface [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      <PaginationDots count={icons.length} activeIndex={activeIndex} />
    </div>
  );
}
