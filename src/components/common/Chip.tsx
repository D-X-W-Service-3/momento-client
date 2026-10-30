import type { ReactNode } from 'react';

export type ChipTone = 'info' | 'success' | 'warning' | 'neutral';

const TONE_STYLES: Record<ChipTone, string> = {
  info: 'bg-info-bg text-info-text',
  success: 'bg-success-bg text-success-text',
  warning: 'bg-warning-bg text-warning-text',
  neutral: 'bg-neutral-bg text-ink-faint',
};

interface ChipProps {
  tone: ChipTone;
  children: ReactNode;
  className?: string;
}

// Figma DESIGN.md §5.4 radius full · label 타이포 · 패딩 4/10.
// 색만으로 의미를 전달하지 않는다 — 항상 텍스트를 함께 쓴다.
export default function Chip({ tone, children, className = '' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-label font-medium whitespace-nowrap ${TONE_STYLES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
