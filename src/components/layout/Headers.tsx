import { Link, useNavigate } from 'react-router-dom';

import { BellIcon, ChevronLeft, MoreIcon } from '@/components/common/Icons';

export function BrandHeader() {
  return (
    <header className="brand-header">
      <Link to="/home" aria-label="Momento 홈으로">
        <strong>Momento</strong>
      </Link>
      <button type="button" aria-label="알림">
        <BellIcon />
      </button>
    </header>
  );
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
