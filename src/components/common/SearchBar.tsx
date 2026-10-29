import type { InputHTMLAttributes } from 'react';

import searchIcon from '@/assets/icons/search.svg';

type SearchBarProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default function SearchBar({
  className = '',
  ...props
}: SearchBarProps) {
  return (
    <label
      className={`flex h-12 w-full items-center gap-2 rounded-full bg-surface px-4 shadow-level-1 ${className}`}
    >
      <input
        type="search"
        className="min-w-0 flex-1 bg-transparent text-body-sm text-ink outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      <img src={searchIcon} alt="" className="size-[16.5px] shrink-0" />
    </label>
  );
}
