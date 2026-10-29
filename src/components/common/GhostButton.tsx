import type { ButtonHTMLAttributes } from 'react';

/** 어두운 배경 위에 반투명하게 올라가는 보조 버튼 (캡슐 상세 전용) */
export default function GhostButton({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-[41px] w-full items-center justify-center rounded-md bg-white/10 px-5 text-button-sm font-semibold text-on-primary ${className}`}
      {...props}
    />
  );
}
