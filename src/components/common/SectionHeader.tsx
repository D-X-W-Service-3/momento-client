import chevronRightIcon from '@/assets/icons/chevron-right.svg';

interface SectionHeaderProps {
  title: string;
  /** 제목 옆 보조 수치. 예: "13통", "12명" */
  count?: string;
  /** 넘기면 우측에 전체보기 링크를 노출한다 */
  onViewAll?: () => void;
  /** 제목 뒤 괄호 설명. 예: "(방장전용)" */
  note?: string;
}

// 어두운 배경 위 섹션 제목 줄.
export default function SectionHeader({
  title,
  count,
  onViewAll,
  note,
}: SectionHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="flex items-center gap-stack text-button font-semibold text-on-primary">
        <span>
          {title}
          {/* 괄호 설명은 제목과 같은 줄에 베이스라인을 맞춰 붙인다 */}
          {note && (
            <span className="ml-1 font-display text-label font-medium text-on-primary/70">
              {note}
            </span>
          )}
        </span>
        {count && <span className="text-on-primary/70">{count}</span>}
      </h2>
      {onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-[5px] text-button-sm font-semibold text-on-primary/70"
        >
          전체보기
          <img src={chevronRightIcon} alt="" className="h-2.5 w-[5.75px]" />
        </button>
      )}
    </div>
  );
}
