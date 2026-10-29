import { useId } from 'react';

import CharacterCount from '@/components/common/CharacterCount';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength: number;
}

/** 한 줄 입력 + 글자수. 밝은 폼 화면 전용. */
export default function TextField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: TextFieldProps) {
  const id = useId();

  return (
    <div className="flex w-full flex-col gap-stack">
      <label
        htmlFor={id}
        className="font-display text-field-label font-medium text-field-ink"
      >
        {label}
      </label>
      <div className="flex h-14 w-full items-center gap-stack rounded-md bg-surface px-4 text-field-hint">
        <input
          id={id}
          type="text"
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 font-display text-field-value text-ink placeholder:text-field-hint focus:outline-none"
        />
        <CharacterCount value={value.length} max={maxLength} />
      </div>
    </div>
  );
}
