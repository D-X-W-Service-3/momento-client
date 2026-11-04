import { textStyles } from '@/styles/tokens';

interface CalendarPeriodGridProps {
  id?: string;
  options: number[];
  selected: number;
  suffix: '년' | '월';
  isDisabled?: (value: number) => boolean;
  onSelect: (value: number) => void;
}

export default function CalendarPeriodGrid({
  id,
  options,
  selected,
  suffix,
  isDisabled,
  onSelect,
}: CalendarPeriodGridProps) {
  return (
    <div
      id={id}
      role="group"
      aria-label={suffix === '년' ? '년도 선택 목록' : '월 선택 목록'}
      className="grid min-h-[256px] grid-cols-4 grid-rows-3 gap-2 py-2"
    >
      {options.map((option) => {
        const disabled = isDisabled?.(option) ?? false;
        const isSelected = option === selected && !disabled;
        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            onClick={() => onSelect(option)}
            className={`flex items-center justify-center rounded-lg transition-colors ${
              isSelected
                ? 'bg-primary text-text-on-primary cursor-pointer'
                : disabled
                  ? 'text-text-primary/25 cursor-not-allowed'
                  : 'bg-surface-gray text-text-primary cursor-pointer'
            } ${textStyles['body-medium']}`}
          >
            {option}
            {suffix}
          </button>
        );
      })}
    </div>
  );
}
