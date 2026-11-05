import type { ReactNode } from 'react';

interface StickyBottomBarProps {
  children: ReactNode;
  /** 배경색 클래스. 페이지 배경과 맞춰야 스크롤되는 내용이 비치지 않는다. */
  className?: string;
}

/**
 * 화면 하단 고정 버튼 영역.
 * 내용이 화면보다 길면 내용만 스크롤되고 버튼은 화면 아래(홈 인디케이터 위)에 붙어 있다.
 * px-5 부모 안에서 쓰는 것을 전제로 좌우를 꽉 채운다.
 */
export default function StickyBottomBar({
  children,
  className = '',
}: StickyBottomBarProps) {
  return (
    <div
      className={`sticky bottom-0 z-20 -mx-5 mt-auto px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] ${className}`}
    >
      {children}
    </div>
  );
}
