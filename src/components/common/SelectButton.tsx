import type { ReactNode } from 'react';

interface SelectButtonProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  /** 버튼에 보여줄 내용. 기본은 선택된 옵션의 label */
  children?: ReactNode;
  icon: string;
  iconClassName: string;
  className?: string;
  ariaLabel: string;
}

// 텍스트 + 화살표 모양의 드롭다운. 모바일에서는 OS 기본 선택창이 뜬다.
export default function SelectButton<T extends string>({
  value,
  options,
  onChange,
  children,
  icon,
  iconClassName,
  className = '',
  ariaLabel,
}: SelectButtonProps<T>) {
  const selected = options.find((option) => option.value === value);

  return (
    <label className={`relative flex items-center gap-1 ${className}`}>
      {children ?? selected?.label}
      <img src={icon} alt="" className={iconClassName} />
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
