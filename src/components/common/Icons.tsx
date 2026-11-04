type IconProps = { className?: string };

const base = 'h-5 w-5';

export function ChevronLeft({ className = base }: IconProps) {
  return (
    <span className={className} aria-hidden="true">
      ‹
    </span>
  );
}

export function ChevronRight({ className = base }: IconProps) {
  return (
    <img
      className={className}
      src="/assets/archive/icon-1.svg"
      alt=""
      aria-hidden="true"
    />
  );
}

export function SearchIcon({ className = base }: IconProps) {
  return (
    <img
      className={className}
      src="/assets/archive/icon-2.svg"
      alt=""
      aria-hidden="true"
    />
  );
}

export function BellIcon({ className = base }: IconProps) {
  return (
    <img
      className={className}
      src="/assets/archive/icon-6.svg"
      alt=""
      aria-hidden="true"
    />
  );
}

export function MoreIcon({ className = base }: IconProps) {
  return (
    <span className={className} aria-hidden="true">
      ⋮
    </span>
  );
}

export function PlusIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3V21M3 12H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
