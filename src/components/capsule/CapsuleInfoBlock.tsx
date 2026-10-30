import Chip, { type ChipTone } from '@/components/common/Chip';
import type { CapsuleDetail } from '@/types/capsule';
import { formatDotDate } from '@/utils/date';

export interface CapsuleInfoChip {
  label: string;
  tone: ChipTone;
}

interface CapsuleInfoBlockProps {
  capsule: CapsuleDetail;
  chips: CapsuleInfoChip[];
}

/** 캡슐 상세 상단의 칩 + 제목 + 설명 + 개봉 정보 + 구분선 */
export default function CapsuleInfoBlock({
  capsule,
  chips,
}: CapsuleInfoBlockProps) {
  return (
    <section className="flex w-full flex-col gap-list">
      <div className="flex w-full items-end justify-between gap-list">
        <div className="flex min-w-0 flex-col gap-stack">
          <div className="flex gap-stack">
            {chips.map((chip) => (
              <Chip key={chip.label} tone={chip.tone} className="font-display">
                {chip.label}
              </Chip>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-title-sm font-semibold text-on-primary">
              {capsule.title}
            </h1>
            <p className="font-display text-meta whitespace-pre-line text-on-primary/70">
              {capsule.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-end font-display text-meta whitespace-nowrap text-on-primary/50">
          <p>
            {capsule.memberCount}명 | 편지 {capsule.letterCount}
          </p>
          <p>{formatDotDate(capsule.openDate)} 개봉</p>
        </div>
      </div>

      <hr className="h-px w-full border-0 bg-white/10" />
    </section>
  );
}
