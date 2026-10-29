interface PageDotsProps {
  total: number;
  current: number;
  onSelect?: (index: number) => void;
}

export default function PageDots({ total, current, onSelect }: PageDotsProps) {
  return (
    <div
      className="flex items-center gap-2"
      role="tablist"
      aria-label="온보딩 단계"
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`${index + 1}단계`}
            onClick={() => onSelect?.(index)}
            className={`h-2 w-2 cursor-pointer rounded-full transition-colors ${
              isActive ? 'bg-primary' : 'bg-border-default'
            }`}
          />
        );
      })}
    </div>
  );
}
