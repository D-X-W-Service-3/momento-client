import MyPageChevronRightIcon from '@/assets/icons/mypage-chevron-right.svg?react';
import { textStyles } from '@/styles/tokens';

interface AccountMenuCardProps {
  onNotificationSettings: () => void;
  onLogout: () => void;
  onWithdraw: () => void;
}

export default function AccountMenuCard({
  onNotificationSettings,
  onLogout,
  onWithdraw,
}: AccountMenuCardProps) {
  const menuItems = [
    { label: '알림 설정', onClick: onNotificationSettings },
    { label: '로그아웃', onClick: onLogout },
    { label: '회원탈퇴', onClick: onWithdraw },
  ];

  return (
    <section className="bg-surface-white flex w-full flex-col gap-4 rounded-lg p-4">
      {menuItems.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          className="flex h-6 w-full cursor-pointer items-center justify-between"
        >
          <span className={`text-text-dark ${textStyles['menu-item']}`}>
            {item.label}
          </span>
          <span className="flex h-6 w-6 items-center justify-center">
            <MyPageChevronRightIcon className="h-[11px] w-[6px]" />
          </span>
        </button>
      ))}
    </section>
  );
}
