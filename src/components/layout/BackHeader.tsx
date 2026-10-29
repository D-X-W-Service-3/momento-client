import { useNavigate } from 'react-router-dom';

import backWhiteIcon from '@/assets/icons/back-white.svg';
import backIcon from '@/assets/icons/back.svg';

interface BackHeaderProps {
  /** 생략하면 뒤로가기 버튼만 있는 투명 헤더 */
  title?: string;
  /** dark: 어두운 배경 위에 올릴 때 흰색 아이콘/타이틀 */
  tone?: 'light' | 'dark';
  /** 뒤로가기를 가로채고 싶을 때 (예: 작성 취소 확인) */
  onBack?: () => void;
}

// AppBar 변형: 좌측 뒤로가기, 타이틀 중앙 정렬
export default function BackHeader({
  title,
  tone = 'light',
  onBack,
}: BackHeaderProps) {
  const navigate = useNavigate();
  const isDark = tone === 'dark';

  return (
    <header className="flex h-14 w-full items-center justify-between px-[25px]">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => (onBack ? onBack() : navigate(-1))}
        className="-m-3 p-3"
      >
        <img
          src={isDark ? backWhiteIcon : backIcon}
          alt=""
          className="h-[15.8px] w-[8.8px]"
        />
      </button>
      {title && (
        <h1
          className={`text-title-sm font-semibold ${isDark ? 'text-on-primary' : 'text-ink'}`}
        >
          {title}
        </h1>
      )}
      {/* 타이틀 중앙 정렬용 여백 */}
      <span aria-hidden className="w-[8.8px]" />
    </header>
  );
}
