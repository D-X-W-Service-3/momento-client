import { useNavigate } from 'react-router-dom';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';
import MoreVerticalIcon from '@/assets/icons/more-vertical.svg?react';
import { textStyles } from '@/styles/tokens';

interface BackHeaderProps {
  title?: string;
  /** 생략하면 브라우저 뒤로가기 */
  onBack?: () => void;
  showMore?: boolean;
  onMore?: () => void;
  /** dark: 어두운 배경 위에 올릴 때 흰색 아이콘/타이틀 */
  tone?: 'light' | 'dark';
  className?: string;
}

export default function BackHeader({
  title = '',
  onBack,
  showMore = false,
  onMore,
  tone = 'light',
  className = '',
}: BackHeaderProps) {
  const navigate = useNavigate();
  const isDark = tone === 'dark';
  // 아이콘 SVG 에 선 색이 박혀 있어서, 어두운 배경에서는 currentColor 로 덮어쓴다.
  const iconTone = isDark ? '[&_path]:stroke-current' : '';

  return (
    <header
      className={`sticky top-0 z-30 flex h-14 w-full items-center justify-between pl-[25px] ${
        showMore ? 'pr-[25px]' : 'pr-5'
      } ${isDark ? 'text-text-on-primary' : 'text-text-primary'} ${className}`}
    >
      <button
        type="button"
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="뒤로 가기"
        className={`-ml-2 flex h-8 w-8 cursor-pointer items-center justify-center ${iconTone}`}
      >
        <ChevronLeftIcon className="h-[14px] w-[7px]" />
      </button>

      <h1 className={`text-center ${textStyles['header-title']}`}>{title}</h1>

      {showMore ? (
        <button
          type="button"
          onClick={onMore}
          aria-label="더보기"
          className={`-mr-2 flex h-8 w-8 cursor-pointer items-center justify-center ${iconTone}`}
        >
          <MoreVerticalIcon className="h-[14px] w-[2px]" />
        </button>
      ) : (
        <span className="h-[14px] w-[7px]" aria-hidden="true" />
      )}
    </header>
  );
}
