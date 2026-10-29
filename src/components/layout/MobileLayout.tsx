import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type MobileLayoutProps = {
  children: ReactNode;
  withNav?: boolean;
  variant?: 'white' | 'gray';
  className?: string;
};

const navItems = [
  {
    to: '/home',
    icon: '/assets/archive/icon-5.svg',
    inactiveIcon: '/assets/archive/icon-home-inactive.svg',
    label: '홈',
  },
  {
    to: '/calendar',
    icon: '/assets/archive/icon-calendar-active.svg',
    inactiveIcon: '/assets/archive/icon-4.svg',
    label: '캘린더',
  },
  { to: '/capsules', icon: '/assets/archive/icon-7.svg', label: '타임캡슐' },
  {
    to: '/archives',
    icon: '/assets/archive/icon-3.svg',
    inactiveIcon: '/assets/archive/icon-archive-inactive.svg',
    label: '아카이브',
  },
];

export default function MobileLayout({
  children,
  withNav = false,
  variant,
  className = '',
}: MobileLayoutProps) {
  if (variant) {
    const bgClass = variant === 'gray' ? 'bg-surface-gray' : 'bg-surface-white';

    return (
      <div
        className={`mx-auto flex min-h-[100dvh] w-full max-w-[393px] flex-col ${bgClass} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <main className="app-shell">
      <div className={withNav ? 'app-content with-nav' : 'app-content'}>
        {children}
      </div>
      {withNav && (
        <nav className="bottom-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {({ isActive }) => (
                <>
                  <img
                    className="nav-icon"
                    src={
                      isActive
                        ? item.icon
                        : 'inactiveIcon' in item
                          ? item.inactiveIcon
                          : item.icon
                    }
                    alt=""
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </main>
  );
}
