import type { ReactNode } from 'react';
import { textStyles } from '@/styles/tokens';

interface PageIntroProps {
  title: string;
  description: ReactNode;
  illustration: ReactNode;
  children: ReactNode;
}

export default function PageIntro({
  title,
  description,
  illustration,
  children,
}: PageIntroProps) {
  return (
    <section className="flex w-full flex-col" data-page-intro>
      <div className="flex h-[200px] w-full items-center justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 py-10">
          <h1 className={`text-text-primary ${textStyles['heading-h2']}`}>
            {title}
          </h1>
          <p className={`text-text-secondary ${textStyles['body-xs']}`}>
            {description}
          </p>
        </div>
        <div className="flex h-[168px] w-[171px] max-w-[50%] shrink-0 items-center justify-center [&>img]:max-h-full [&>img]:max-w-full [&>img]:object-contain">
          {illustration}
        </div>
      </div>
      <div
        className="relative z-10 -mt-[30px] flex w-full flex-col gap-3"
        data-page-controls
      >
        {children}
      </div>
    </section>
  );
}
