import { useHorizontalDragScroll } from '@/hooks/useHorizontalDragScroll';
import { textStyles } from '@/styles/tokens';

interface FilterChipsProps<T extends string | number> {
  options: { key: T; label: string; count: number }[];
  selected: T;
  onSelect: (key: T) => void;
}

export default function FilterChips<T extends string | number>({
  options,
  selected,
  onSelect,
}: FilterChipsProps<T>) {
  const { containerRef, dragProps } = useHorizontalDragScroll<HTMLDivElement>();
  return (
    <div
      ref={containerRef}
      {...dragProps}
      className="-mr-5 flex cursor-grab touch-pan-x items-center gap-[6px] overflow-x-auto pr-5 select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      aria-label="목록 필터"
    >
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          aria-pressed={selected === option.key}
          onClick={() => onSelect(option.key)}
          className={`flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-3 transition-colors ${selected === option.key ? 'bg-text-label text-surface-white' : 'border-border-input text-text-button-sub border bg-transparent'} ${textStyles['field-label']}`}
        >
          {option.label} {option.count}
        </button>
      ))}
    </div>
  );
}
