import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import chevronDownSmIcon from '@/assets/icons/chevron-down-sm.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import ArchiveCard from '@/components/common/ArchiveCard';
import CapsuleCard from '@/components/common/CapsuleCard';
import SearchBar from '@/components/common/SearchBar';
import SelectButton from '@/components/common/SelectButton';
import BackHeader from '@/components/layout/BackHeader';
import { useSearchMemories } from '@/hooks/useSearch';
import type { CalendarFilter } from '@/types/calendar';

type SortOrder = 'latest' | 'oldest';

const CATEGORY_OPTIONS: { value: CalendarFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'capsule', label: '캡슐' },
  { value: 'archive', label: '아카이브' },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
];

const sortByDate = <T,>(
  items: T[],
  getDate: (item: T) => string,
  order: SortOrder,
) =>
  [...items].sort((a, b) =>
    order === 'latest'
      ? getDate(b).localeCompare(getDate(a))
      : getDate(a).localeCompare(getDate(b)),
  );

export default function CalendarSearchPage() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<CalendarFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const { data } = useSearchMemories(keyword);
  const reduceMotion = useReducedMotion();

  const capsules =
    category === 'archive'
      ? []
      : sortByDate(data?.capsules ?? [], (c) => c.openDate, sortOrder);
  const archives =
    category === 'capsule'
      ? []
      : sortByDate(data?.archives ?? [], (a) => a.date, sortOrder);
  const totalCount = capsules.length + archives.length;
  const categoryLabel = CATEGORY_OPTIONS.find(
    (option) => option.value === category,
  )?.label;

  return (
    // 캘린더 위에 겹쳐서 오른쪽에서 들어오고, 뒤로가기 시 오른쪽으로 빠진다.
    <motion.div
      initial={reduceMotion ? false : { x: '100%' }}
      animate={{ x: 0 }}
      exit={reduceMotion ? undefined : { x: '100%' }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-20 overflow-y-auto overscroll-contain bg-background"
    >
      <div className="mx-auto w-full max-w-md pt-[env(safe-area-inset-top)] pb-[max(20px,env(safe-area-inset-bottom))]">
        <BackHeader title="검색" />

        <main className="flex flex-col gap-card px-5 pt-2.5">
          <SearchBar
            autoFocus
            placeholder="캡슐 및 아카이브 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <section className="flex flex-col gap-list">
            <div className="flex items-center justify-between">
              <SelectButton
                ariaLabel="검색 분류"
                value={category}
                options={CATEGORY_OPTIONS}
                onChange={setCategory}
                icon={chevronDownIcon}
                iconClassName="size-3.5"
                className="text-button-sm font-semibold text-ink"
              >
                {categoryLabel} {totalCount}개
              </SelectButton>
              <SelectButton
                ariaLabel="정렬"
                value={sortOrder}
                options={SORT_OPTIONS}
                onChange={setSortOrder}
                icon={chevronDownSmIcon}
                iconClassName="size-3"
                className="text-label font-medium text-ink-muted"
              />
            </div>

            <div className="flex flex-col gap-card">
              {capsules.length > 0 && (
                <div className="flex flex-col gap-list">
                  <h2 className="text-label font-medium text-ink-muted">
                    타임캡슐
                  </h2>
                  {capsules.map((capsule) => (
                    <CapsuleCard key={capsule.id} capsule={capsule} />
                  ))}
                </div>
              )}

              {archives.length > 0 && (
                <div className="flex flex-col gap-list">
                  <h2 className="text-label font-medium text-ink-muted">
                    아카이브
                  </h2>
                  {archives.map((archive) => (
                    <ArchiveCard key={archive.id} archive={archive} />
                  ))}
                </div>
              )}

              {data && totalCount === 0 && (
                <p className="py-section text-center text-caption text-ink-faint">
                  검색 결과가 없어요
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </motion.div>
  );
}
