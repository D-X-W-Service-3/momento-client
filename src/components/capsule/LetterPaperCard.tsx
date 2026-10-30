import checkedCircleIcon from '@/assets/icons/selection-circle-checked.svg';
import circleIcon from '@/assets/icons/selection-circle.svg';
import type { LetterPaper } from '@/types/letter';

interface LetterPaperCardProps {
  paper: LetterPaper;
  selected: boolean;
  onSelect: () => void;
}

/** 우표 모양 편지지 선택 카드. 미선택은 흐리게 보여준다. */
export default function LetterPaperCard({
  paper,
  selected,
  onSelect,
}: LetterPaperCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="relative block aspect-square w-full"
    >
      <img
        src={paper.imageUrl}
        alt={paper.name}
        loading="lazy"
        className={`size-full object-cover ${selected ? '' : 'opacity-72'}`}
      />

      <span className="absolute top-2 right-2 block size-6">
        <img
          src={selected ? checkedCircleIcon : circleIcon}
          alt=""
          className="size-full"
        />
        {selected && (
          <span className="absolute inset-0 flex items-center justify-center text-button font-bold text-on-primary">
            ✓
          </span>
        )}
      </span>

      {selected && (
        <span className="absolute right-[9px] bottom-[10px] flex h-[21px] w-[52px] items-center justify-center rounded-full bg-badge-bg text-[11px] font-bold text-badge-text">
          선택됨
        </span>
      )}
    </button>
  );
}
