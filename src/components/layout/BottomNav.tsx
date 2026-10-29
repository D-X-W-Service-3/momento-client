import type { FC, SVGProps } from 'react';
import { NavLink } from 'react-router-dom';

import ArchiveIcon from '@/assets/icons/nav-archive.svg?react';
import CalendarIcon from '@/assets/icons/nav-calendar.svg?react';
import CapsuleIcon from '@/assets/icons/nav-capsule.svg?react';
import HomeIcon from '@/assets/icons/nav-home.svg?react';
import MypageIcon from '@/assets/icons/nav-mypage.svg?react';
import { ROUTES } from '@/constants/routes';

const NAV_ITEMS: {
  to: string;
  label: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
  iconClassName: string;
}[] = [
  {
    to: ROUTES.HOME,
    label: '홈',
    Icon: HomeIcon,
    iconClassName: 'h-[21px] w-[25px]',
  },
  {
    to: ROUTES.CALENDAR,
    label: '캘린더',
    Icon: CalendarIcon,
    iconClassName: 'size-[21px]',
  },
  {
    to: ROUTES.CAPSULE,
    label: '타임캡슐',
    Icon: CapsuleIcon,
    iconClassName: 'h-[21px] w-6',
  },
  {
    to: ROUTES.ARCHIVE,
    label: '아카이브',
    Icon: ArchiveIcon,
    iconClassName: 'h-[21px] w-[25px]',
  },
  {
    to: ROUTES.MYPAGE,
    label: '마이페이지',
    Icon: MypageIcon,
    iconClassName: 'h-[21px] w-[17px]',
  },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md p-2.5 pb-[max(10px,env(safe-area-inset-bottom))]">
      <ul className="flex items-center justify-between rounded-lg border border-glass-border bg-primary-tint-strong p-2.5 shadow-floating backdrop-blur-[10px]">
        {NAV_ITEMS.map(({ to, label, Icon, iconClassName }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex h-[50px] w-[60px] flex-col items-center justify-center gap-[7px] text-label leading-[1.2] font-medium tracking-normal whitespace-nowrap ${
                  isActive ? 'text-primary-strong' : 'text-icon-default'
                }`
              }
            >
              <Icon className={iconClassName} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
