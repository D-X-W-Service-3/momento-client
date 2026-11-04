import CheckCircleOutlineIcon from '@/assets/icons/check-circle-outline.svg?react';
import CheckCircleSolidIcon from '@/assets/icons/check-circle-solid.svg?react';
import { textStyles } from '@/styles/tokens';
import type { CapsuleCreateType } from '@/types/capsule';

interface CapsuleTypeStepProps {
  selected: CapsuleCreateType;
  onSelect: (type: CapsuleCreateType) => void;
}

const OPTIONS: {
  key: CapsuleCreateType;
  title: string;
  description: string;
}[] = [
  {
    key: 'solo',
    title: '나 혼자만의 캡슐을 만들고 싶어요',
    description: '나만 볼 수 있는 캡슐이에요',
  },
  {
    key: 'friend',
    title: '친구와 함께 만들고 열어볼 캡슐이에요',
    description: '친구와 함께 편지를 넣고 열어볼 수 있어요',
  },
  {
    key: 'group',
    title: '여러 명이 함께 만들고 싶어요',
    description: '참여자와 수신자를 원하는 대로 설정할 수 있어요',
  },
];

export default function CapsuleTypeStep({
  selected,
  onSelect,
}: CapsuleTypeStepProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className={`text-black ${textStyles['heading-h2']}`}>
          어떤 캡슐을 만들어 볼까요?
        </h2>
        <p className={`text-text-secondary ${textStyles['body-xs']}`}>
          캡슐을 만드는 방식을 선택해주세요
          <br />
          종류를 선택한 다음에는 변경할 수 없어요
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
