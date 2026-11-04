import ChevronRightSmIcon from '@/assets/icons/chevron-right-sm.svg?react';
import { textStyles } from '@/styles/tokens';

interface CapsuleRequestBannerProps {
  onClick?: () => void;
}

export default function CapsuleRequestBanner({
  onClick,
}: CapsuleRequestBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="capsule-request-banner flex min-h-[53px] w-full cursor-pointer items-center justify-between rounded-xl px-5 py-[10px] text-left"
    >
      <div className="flex flex-col">
        <span className={`text-text-secondary ${textStyles['body-small-med']}`}>
          참여 요청받은 타임캡슐이 있어요
        </span>
        <strong
          className={`text-text-primary ${textStyles['body-medium-semi-tight']}`}
        >
          지금 확인하기
        </strong>
      </div>
      <ChevronRightSmIcon className="h-3 w-[7px] shrink-0" />
    </button>
  );
}
