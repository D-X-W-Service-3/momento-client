import { useId } from 'react';

import CharacterCount from '@/components/common/CharacterCount';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  helperText?: string;
  isError?: boolean;
  variant?: 'filled' | 'outlined';
  className?: string;
}

/** 한 줄 텍스트 입력 (선택적 글자수 카운터 / 도움말·오류 문구 지원) */
export default function TextField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  helperText,
  isError = false,
  variant = 'filled',
  className = '',
}: TextFieldProps) {
  const id = useId();
  const boxStyle =
    variant === 'outlined'
      ? `h-[52px] border bg-surface-white transition-colors ${
          isError
            ? 'border-status-error'
            : 'border-border-default focus-within:border-primary'
        }`
      : 'h-14 bg-surface';

  return (
    <div className={`flex w-full flex-col gap-stack ${className}`}>
      <label
        htmlFor={id}
        className="font-display text-field-label font-medium text-field-ink"
      >
        {label}
      </label>
      <div
        className={`flex w-full items-center gap-stack rounded-lg px-4 text-field-hint ${boxStyle}`}
      >
        <input
          id={id}
          type="text"
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent font-display text-field-value text-ink placeholder:text-field-hint focus:outline-none"
        />
        {maxLength !== undefined && (
          <CharacterCount value={value.length} max={maxLength} />
        )}
      </div>
      {helperText && (
        <p
          className={`text-meta ${
            isError ? 'text-status-error' : 'text-primary-dark'
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
