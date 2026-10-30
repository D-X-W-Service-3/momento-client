interface PaginationDotsProps {
  count: number;
  activeIndex: number;
}

/** 캐러셀 순서 표시. 6px 점을 6px 간격으로 늘어놓는다. */
export default function PaginationDots({
  count,
  activeIndex,
}: PaginationDotsProps) {
  return (
    <ul aria-hidden className="flex h-1.5 items-center justify-center gap-1.5">
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className={`size-1.5 rounded-full ${
            index === activeIndex ? 'bg-primary-strong' : 'bg-ink/16'
          }`}
        />
      ))}
    </ul>
  );
}
