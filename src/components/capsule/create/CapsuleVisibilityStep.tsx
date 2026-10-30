import CheckCircleOutlineIcon from '@/assets/icons/check-circle-outline.svg?react';
import CheckCircleSolidIcon from '@/assets/icons/check-circle-solid.svg?react';
import { textStyles } from '@/styles/tokens';
import type { CapsuleVisibilityType } from '@/types/capsule';

interface CapsuleVisibilityStepProps {
  selected: CapsuleVisibilityType;
  onSelect: (visibility: CapsuleVisibilityType) => void;
}

const OPTIONS: {
  key: CapsuleVisibilityType;
  title: string;
  description: string;
}[] = [
  {
    key: 'all_participants',
    title: '참여한 사람 모두가 캡슐을 열어볼게요',
    description: '졸업이나 친구 모임 기념 캡슐에 적합해요',
  },
  {
    key: 'designated_only',
    title: '지정한 사람만 캡슐을 열어볼게요',
    description: '생일 편지나 롤링페이퍼에 적합해요',
  },
];

export default function CapsuleVisibilityStep({
  selected,
  onSelect,
}: CapsuleVisibilityStepProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className={`text-black ${textStyles['heading-h2']}`}>
          누가 캡슐을 볼 수 있나요?
        </h2>
        <p className={`text-text-secondary ${textStyles['body-xs']}`}>
          캡슐을 열어볼 수 있는 사람을 선택해 주세요
          <br />
          선택한 후에는 변경할 수 없어요
        </p>
      </div>

      <div className="flex w-full flex-col gap-5">
        {OPTIONS.map((option) => {
          const isSelected = option.key === selected;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(option.key)}
              className={`flex min-h-[81px] w-full cursor-pointer items-center justify-between gap-3 rounded-lg border p-5 text-left transition-colors ${
                isSelected
                  ? 'border-primary bg-primary-tint'
                  : 'bg-surface-white border-transparent'
              }`}
            >
              <div className="flex flex-col gap-1">
                <strong
                  className={`text-text-primary ${textStyles['body-large-semi']}`}
                >
                  {option.title}
                </strong>
                <span
                  className={`text-text-placeholder ${textStyles['body-xs']}`}
                >
                  {option.description}
                </span>
              </div>

              {isSelected ? (
                <CheckCircleSolidIcon className="h-5 w-5 shrink-0" />
              ) : (
                <CheckCircleOutlineIcon className="h-5 w-5 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
