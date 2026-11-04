interface PaginationDotsProps {
  count: number;
  activeIndex: number;
  onSelect?: (index: number) => void;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

/** 캐러셀/온보딩 순서 표시 공용 점 인디케이터. */
export default function PaginationDots({
  count,
  activeIndex,
  onSelect,
  size = 'sm',
  ariaLabel = '슬라이드 순서',
}: PaginationDotsProps) {
  const dotSizeClass = size === 'md' ? 'size-2' : 'size-1.5';
  const gapClass = size === 'md' ? 'gap-2' : 'gap-1.5';

  if (onSelect) {
    return (
      <div
        className={`flex items-center justify-center ${gapClass}`}
        role="tablist"
        aria-label={ariaLabel}
      >
        {Array.from({ length: count }, (_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${index + 1}단계`}
              onClick={() => onSelect(index)}
              className={`${dotSizeClass} cursor-pointer rounded-full transition-colors ${
                isActive ? 'bg-primary-strong' : 'bg-ink/16'
              }`}
            />
          );
        })}
      </div>
    );
  }

  return (
    <ul aria-hidden className={`flex items-center justify-center ${gapClass}`}>
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className={`${dotSizeClass} rounded-full ${
            index === activeIndex ? 'bg-primary-strong' : 'bg-ink/16'
          }`}
        />
      ))}
    </ul>
  );
}
