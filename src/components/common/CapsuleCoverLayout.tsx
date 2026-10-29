import type { ReactNode } from 'react';

import FloatingLetters from '@/components/common/FloatingLetters';
import BackHeader from '@/components/layout/BackHeader';

interface CapsuleCoverLayoutProps {
  /** 두 줄 고정 대제목 */
  titleLines: [string, string];
  /** 하단 버튼들 */
  children: ReactNode;
}

/** 떠다니는 편지 배경 위에 대제목과 하단 버튼을 올리는 몰입 화면 공통 레이아웃 */
export default function CapsuleCoverLayout({
  titleLines,
  children,
}: CapsuleCoverLayoutProps) {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-capsule-bg-from to-capsule-bg-to">
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden pt-[env(safe-area-inset-top)]">
        <FloatingLetters />

        <div className="relative flex flex-1 flex-col">
          <BackHeader tone="dark" />

          <h1 className="mt-6 bg-[linear-gradient(109.3deg,var(--color-capsule-title-from)_1.79%,var(--color-capsule-title-to)_106.3%)] bg-clip-text px-5 text-center font-display text-title-lg font-bold text-transparent">
            {titleLines[0]}
            <br />
            {titleLines[1]}
          </h1>

          <div className="mt-auto flex flex-col gap-list px-5 pb-[max(20px,env(safe-area-inset-bottom))]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
