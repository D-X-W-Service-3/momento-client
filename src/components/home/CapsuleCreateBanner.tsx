import ChevronRightLgIcon from '@/assets/icons/chevron-right-lg.svg?react';
import homeRecommendMomo from '@/assets/images/home-recommend-momo.png';
import { textStyles } from '@/styles/tokens';

interface CapsuleCreateBannerProps {
  onClick?: () => void;
}

export default function CapsuleCreateBanner({
  onClick,
}: CapsuleCreateBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-surface-white flex h-[70px] w-full cursor-pointer items-center justify-between rounded-xl px-5 py-[10px] text-left transition-opacity active:opacity-90"
    >
      <div className="flex items-center gap-2">
        <img
          src={homeRecommendMomo}
          alt="편지를 쓰는 모모"
          className="h-[50px] w-[50px] shrink-0 object-contain"
        />
        <div className="flex flex-col">
          <span className={`text-text-secondary ${textStyles['body-xs']}`}>
            요즘 가장 자주 떠오르는 사람이 있나요
          </span>
          <strong className={`text-text-primary ${textStyles['heading-h2']}`}>
            캡슐 만들기
          </strong>
        </div>
      </div>

      <ChevronRightLgIcon className="h-[15px] w-2 shrink-0" />
    </button>
  );
}
