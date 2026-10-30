import { useNavigate } from 'react-router-dom';

import { ChevronLeft, MoreIcon } from '@/components/common/Icons';
import HomeHeader from '@/components/layout/HomeHeader';

export function BrandHeader() {
  return <HomeHeader />;
}

type BackHeaderProps = {
  title: string;
  onMore?: () => void;
  onBack?: () => void;
};

export function BackHeader({ title, onMore, onBack }: BackHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="back-header">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={onBack ?? (() => navigate(-1))}
      >
        <ChevronLeft className="back-glyph" />
      </button>
      <strong>{title}</strong>
      {onMore ? (
        <button type="button" aria-label="더보기" onClick={onMore}>
          <MoreIcon />
        </button>
      ) : (
        <span className="header-spacer" />
      )}
    </header>
  );
}
