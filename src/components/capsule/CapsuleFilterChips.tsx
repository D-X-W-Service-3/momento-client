import { useHorizontalDragScroll } from '@/hooks/useHorizontalDragScroll';
import { textStyles } from '@/styles/tokens';
import type {
  CapsuleFilterChipOption,
  CapsuleFilterKey,
} from '@/types/capsule';

interface CapsuleFilterChipsProps {
  options: CapsuleFilterChipOption[];
  selected: CapsuleFilterKey;
  onSelect: (key: CapsuleFilterKey) => void;
}

export default function CapsuleFilterChips({
  options,
  selected,
  onSelect,
}: CapsuleFilterChipsProps) {
  const { containerRef, dragProps } = useHorizontalDragScroll<HTMLDivElement>();

  return (
    <div
      ref={containerRef}
      {...dragProps}
      className="-mr-5 flex cursor-grab touch-pan-x items-center gap-[6px] overflow-x-auto pr-5 select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => {
        const isActive = option.key === selected;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onSelect(option.key)}
            className={`flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-3 transition-colors ${
              isActive
                ? 'bg-text-label text-surface-white'
                : 'border-border-input text-text-button-sub border bg-transparent'
            } ${textStyles['field-label']}`}
          >
            {option.label} {option.count}
          </button>
        );
      })}
    </div>
  );
}
