import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { textStyles } from '@/styles/tokens';

type ButtonVariant = 'primary' | 'kakao' | 'secondary' | 'plain';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-text-on-primary px-5 disabled:opacity-50',
  kakao: 'bg-kakao text-kakao-label px-5',
  // 흰 배경 + 보라 글씨 (캡슐 커버의 보조 버튼)
  secondary: 'bg-surface-white text-primary px-5 disabled:opacity-50',
  // 색을 지정하지 않는다 — 자체 팔레트를 쓰는 화면에서 className 으로 입힌다.
  plain: 'px-5 disabled:opacity-50',
};

export default function Button({
  variant = 'primary',
  leftIcon,
  fullWidth = true,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-lg transition-opacity active:opacity-90 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${variantClasses[variant]} ${textStyles['button-label']} ${className}`}
      {...rest}
    >
      {leftIcon && (
        <span className="flex shrink-0 items-center justify-center">
          {leftIcon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}
