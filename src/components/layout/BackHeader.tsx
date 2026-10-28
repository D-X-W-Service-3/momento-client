import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';
import MoreVerticalIcon from '@/assets/icons/more-vertical.svg?react';
import { textStyles } from '@/styles/tokens';

interface BackHeaderProps {
  title?: string;
  onBack?: () => void;
  showMore?: boolean;
  onMore?: () => void;
  className?: string;
}

export default function BackHeader({
  title = '',
  onBack,
  showMore = false,
  onMore,
  className = '',
}: BackHeaderProps) {
  return (
    <header
      className={`flex h-14 w-full items-center justify-between pl-[25px] ${
        showMore ? 'pr-[25px]' : 'pr-5'
      } ${className}`}
    >
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로 가기"
        className="-ml-2 flex h-8 w-8 cursor-pointer items-center justify-center"
      >
        <ChevronLeftIcon className="h-[14px] w-[7px]" />
      </button>

      <h1
        className={`text-text-primary text-center ${textStyles['header-title']}`}
      >
        {title}
      </h1>

      {showMore ? (
        <button
          type="button"
          onClick={onMore}
          aria-label="더보기"
          className="-mr-2 flex h-8 w-8 cursor-pointer items-center justify-center"
        >
          <MoreVerticalIcon className="h-[14px] w-[2px]" />
        </button>
      ) : (
        <span className="h-[14px] w-[7px]" aria-hidden="true" />
      )}
    </header>
  );
}
