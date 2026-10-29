import { useId } from 'react';

import CharacterCount from '@/components/common/CharacterCount';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength: number;
  /** 입력 박스 높이를 바깥에서 정한다 (Figma 화면마다 다름) */
  className?: string;
}

/** 여러 줄 입력 + 하단 우측 글자수. 밝은 폼 화면 전용. */
export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  className = '',
}: TextAreaProps) {
  const id = useId();

  return (
    <div className={`flex w-full flex-col gap-stack ${className}`}>
      <label
        htmlFor={id}
        className="font-display text-field-label font-medium text-field-ink"
      >
        {label}
      </label>
      <div className="flex min-h-px flex-1 flex-col justify-between rounded-md bg-surface px-4 py-3.5 text-field-hint">
        <textarea
          id={id}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[52px] w-full flex-1 resize-none font-display text-field-value leading-[1.6] text-ink placeholder:text-field-hint focus:outline-none"
        />
        <CharacterCount
          value={value.length}
          max={maxLength}
          className="self-end"
        />
      </div>
    </div>
  );
}
