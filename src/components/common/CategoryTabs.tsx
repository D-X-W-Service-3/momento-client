import type { CalendarCounts, CalendarFilter } from '@/types/calendar';

const TABS: { value: CalendarFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'capsule', label: '캡슐' },
  { value: 'archive', label: '아카이브' },
];

interface CategoryTabsProps {
  value: CalendarFilter;
  counts?: CalendarCounts;
  onChange: (value: CalendarFilter) => void;
}

export default function CategoryTabs({
  value,
  counts,
  onChange,
}: CategoryTabsProps) {
  return (
    <div role="tablist" className="flex w-full gap-2">
      {TABS.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full border p-list text-label font-medium whitespace-nowrap ${
              selected
                ? 'border-primary-strong bg-info-bg'
                : 'border-hairline bg-white'
            }`}
          >
            <span className="text-ink">{tab.label}</span>
            {counts && (
              <span className="text-primary-strong">{counts[tab.value]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
