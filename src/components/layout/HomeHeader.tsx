import { Link, useNavigate } from 'react-router-dom';

import HomeBellIcon from '@/assets/icons/home-bell.svg?react';
import HomeUserIcon from '@/assets/icons/home-user.svg?react';
import { textStyles } from '@/styles/tokens';

interface HomeHeaderProps {
  onClickBell?: () => void;
  onClickProfile?: () => void;
  hasUnreadNotification?: boolean;
}

export default function HomeHeader({
  onClickBell,
  onClickProfile,
  hasUnreadNotification = false,
}: HomeHeaderProps) {
  const navigate = useNavigate();

  const handleBell = onClickBell ?? (() => navigate('/notifications'));
  const handleProfile = onClickProfile ?? (() => navigate('/mypage'));

  return (
    <header className="bg-surface-gray sticky top-0 z-30 flex h-14 w-full items-center justify-between px-5">
      <Link
        to="/home"
        aria-label="Momento 홈으로"
        className={`text-primary ${textStyles['header-logo']}`}
      >
        Momento
      </Link>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBell}
          aria-label={hasUnreadNotification ? '읽지 않은 알림 있음' : '알림'}
          className="relative flex cursor-pointer items-center justify-center"
        >
          <HomeBellIcon className="h-[18px] w-[17px]" />
          {hasUnreadNotification && (
            <span className="bg-danger absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={handleProfile}
          aria-label="프로필"
          className="flex cursor-pointer items-center justify-center"
        >
          <HomeUserIcon className="h-[18px] w-4" />
        </button>
      </div>
    </header>
  );
}
