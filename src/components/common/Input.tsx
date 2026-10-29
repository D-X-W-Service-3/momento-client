import { useId, type InputHTMLAttributes } from 'react';

import { textStyles } from '@/styles/tokens';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  isError?: boolean;
}

export default function Input({
  label,
  helperText,
  isError = false,
  className = '',
  ...rest
}: InputProps) {
  const inputId = useId();

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-text-primary ${textStyles['body-small-med']}`}
        >
          {label}
        </label>
      )}
      <div
        className={`bg-surface-white flex h-[52px] w-full items-center rounded-lg border px-4 transition-colors ${
          isError
            ? 'border-status-error'
            : 'border-border-default focus-within:border-primary'
        }`}
      >
        <input
          id={inputId}
          className={`text-text-primary placeholder:text-text-placeholder w-full bg-transparent outline-none ${textStyles['body-large']}`}
          {...rest}
        />
      </div>
      {helperText && (
        <p
          className={`${textStyles['body-xs']} ${
            isError ? 'text-status-error' : 'text-primary-dark'
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
