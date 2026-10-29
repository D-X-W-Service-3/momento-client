interface DDayBadgeProps {
  /** 개봉일까지 남은 일수 (0: 당일, 음수: 지난 날) */
  dDay: number;
}

// D-30: 개봉 전 / D-DAY: 당일(강조) / D+5: 개봉 후
export default function DDayBadge({ dDay }: DDayBadgeProps) {
  const { label, className } =
    dDay === 0
      ? { label: 'D-DAY', className: 'bg-primary-strong text-on-primary' }
      : dDay > 0
        ? {
            label: `D-${dDay}`,
            className: 'bg-primary-tint-strong text-primary-strong',
          }
        : { label: `D+${-dDay}`, className: 'bg-fill-subtle text-ink-faint' };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-label font-medium whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}
