import CapsuleCompleteCheckIcon from '@/assets/icons/capsule-complete-check.svg?react';
import { textStyles } from '@/styles/tokens';

interface CapsuleCompleteStepProps {
  isSolo: boolean;
  onGoHome: () => void;
  onOpenInviteSheet: () => void;
  onGoCapsules: () => void;
}

export default function CapsuleCompleteStep({
  isSolo,
  onGoHome,
  onOpenInviteSheet,
  onGoCapsules,
}: CapsuleCompleteStepProps) {
  return (
    <div className="flex flex-1 flex-col justify-between">
      <div className="flex flex-1 flex-col items-center justify-center gap-7 p-5">
        <div className="bg-fab flex h-[72px] w-[72px] items-center justify-center rounded-full">
          <CapsuleCompleteCheckIcon className="h-[18px] w-[26px]" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className={`text-text-dark ${textStyles['heading-h2']}`}>
            생성을 완료했어요!
          </h2>
          <p className="text-text-button-sub text-body-lg leading-[25.6px] font-medium tracking-[-0.32px]">
            시간 속에 맡겨둘 타입캡슐을 만들었어요
            <br />
            지금 바로 편지를 작성해보세요
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[10px] px-5 pt-[10px] pb-5">
        <button
          type="button"
          onClick={isSolo ? onGoHome : onOpenInviteSheet}
          className="border-border-input text-text-button-sub flex h-14 cursor-pointer items-center justify-center rounded-lg border px-4"
        >
          <span className="text-body-lg leading-4 font-semibold tracking-[-0.32px]">
            {isSolo ? '홈으로 가기' : '초대 링크 공유하기'}
          </span>
        </button>

        <button
          type="button"
          onClick={onGoCapsules}
          className="bg-primary text-text-on-primary flex h-14 cursor-pointer items-center justify-center rounded-lg px-4"
        >
          <span className="text-body-lg leading-4 font-semibold tracking-[-0.32px]">
            캡슐 보러가기
          </span>
        </button>
      </div>
    </div>
  );
}
