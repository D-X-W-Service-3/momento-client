import type { ChangeEvent, RefObject } from 'react';

import { SearchIcon } from '@/components/common/Icons';
import { textStyles } from '@/styles/tokens';

interface CapsuleSearchBarProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  readOnly?: boolean;
  autoFocus?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  placeholder?: string;
}

export default function CapsuleSearchBar({
  value = '',
  onChange,
  onClick,
  readOnly = false,
  autoFocus = false,
  inputRef,
  placeholder = '타임캡슐 제목, 참여자, 설명으로 검색',
}: CapsuleSearchBarProps) {
  return (
    <label
      onClick={onClick}
      className={`bg-surface-white flex h-12 w-full items-center justify-between gap-2 rounded-full px-4 shadow-[0_2px_8px_rgb(0_0_0/0.03)] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onFocus={readOnly ? onClick : undefined}
        readOnly={readOnly}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={`text-text-primary placeholder:text-text-placeholder w-full min-w-0 bg-transparent outline-none ${
          onClick ? 'cursor-pointer' : ''
        } ${textStyles['body-medium']}`}
      />
      <span className="text-text-secondary flex shrink-0 items-center justify-center">
        <SearchIcon />
      </span>
    </label>
  );
}
