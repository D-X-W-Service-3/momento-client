import type { ChangeEvent } from 'react';

import { textStyles } from '@/styles/tokens';

interface ProfileEditFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'tel';
  maxLength?: number;
  helperText?: string;
  wrapperClassName?: string;
}

export default function ProfileEditField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  maxLength,
  helperText,
  wrapperClassName = '',
}: ProfileEditFieldProps) {
  return (
    <div className={`flex w-full flex-col gap-2 ${wrapperClassName}`}>
      <label
        htmlFor={id}
        className={`text-text-label ${textStyles['field-label']}`}
      >
        {label}
      </label>

      <div className="border-border-input bg-surface-white flex h-14 w-full items-center justify-between gap-2 rounded-lg border px-4">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={`text-text-dark w-full bg-transparent outline-none ${textStyles['input-value']}`}
        />
        {typeof maxLength === 'number' && (
          <span
            className={`text-text-hint shrink-0 ${textStyles['char-counter']}`}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      {helperText && (
        <p className={`text-text-hint ${textStyles['field-helper']}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
