import type { ReactNode } from 'react';

import informationIcon from '@/assets/icons/information.svg';

interface InfoNoteProps {
  children: ReactNode;
}

/** 연보라 배경의 안내 영역 */
export default function InfoNote({ children }: InfoNoteProps) {
  return (
    <div className="flex w-full items-start gap-stack rounded-md bg-info-bg p-5">
      <img src={informationIcon} alt="" className="size-5 shrink-0" />
      <p className="flex-1 font-display text-caption text-ink-muted">
        {children}
      </p>
    </div>
  );
}
