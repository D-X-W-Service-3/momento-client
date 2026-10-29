import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'plain';

// Figma DESIGN.md §5.2 Button. primary 는 화면당 1개 원칙.
// plain 은 색을 지정하지 않는다 — 자체 팔레트를 쓰는 화면에서 className 으로 입힌다.
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-primary-strong text-on-primary',
  secondary: 'bg-surface text-primary-strong',
  plain: '',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`flex h-[52px] w-full items-center justify-center rounded-md px-5 text-button font-semibold disabled:bg-fill-subtle disabled:text-ink-disabled ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    />
  );
}
