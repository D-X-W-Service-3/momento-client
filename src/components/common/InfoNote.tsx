import type { ReactNode } from 'react';

import informationIcon from '@/assets/icons/information.svg';

interface InfoNoteProps {
  /** 문단이 여러 개면 <p> 로 나눠 넘기면 8px 간격으로 쌓인다 */
  children: ReactNode;
}

/** 연보라 배경의 안내 영역 */
export default function InfoNote({ children }: InfoNoteProps) {
  return (
    <div className="flex w-full items-start gap-stack rounded-lg bg-info-bg p-5">
      <img src={informationIcon} alt="" className="size-5 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-stack font-display text-meta text-ink-muted">
        {children}
      </div>
    </div>
  );
}
