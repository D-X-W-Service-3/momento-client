import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import BottomSheet from '@/components/common/BottomSheet';
import CapsuleSearchBar from '@/components/capsule/CapsuleSearchBar';
import ContentState from '@/components/common/ContentState';
import QueryFeedback from '@/components/common/QueryFeedback';
import CalendarCard from '@/components/calendar/CalendarCards';
import { BackHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import { searchCalendar, toCalendarItems } from '@/apis/momento';
import type { CalendarItem } from '@/types/momento';

const SEARCH_YEARS = Array.from(
  { length: 4 },
  (_, index) => new Date().getFullYear() + index,
);

export default function CalendarSearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [sort, setSort] = useState<'최신순' | '오래된순'>('최신순');
  const [period, setPeriod] = useState('전체 기간');
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);
  const { data, error, isPending, refetch } = useQuery({
    queryKey: ['calendar-search', debouncedQuery, period, sort],
    queryFn: () =>
      searchCalendar(
        debouncedQuery,
        period === '전체 기간' ? undefined : Number.parseInt(period, 10),
        sort === '최신순' ? 'LATEST' : 'OLDEST',
      ),
    enabled: Boolean(debouncedQuery),
    retry: false,
  });
  const results: CalendarItem[] =
    debouncedQuery && data ? toCalendarItems(data) : [];
  const hasQuery = Boolean(query.trim());
  const loading = hasQuery && (query.trim() !== debouncedQuery || isPending);
  const chevron = (
    <svg
      viewBox="0 0 10.75 6.375"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[5px] w-2 shrink-0 rotate-180"
    >
      <path d="M1 5.375L5.375 1L9.75 5.375" />
    </svg>
  );
  return (
    <MobileLayout className="calendar-page calendar-search-page">
      <BackHeader title="검색" />
      <section className="search-page">
        <CapsuleSearchBar
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="캡슐 및 아카이브, 기념일 검색"
        />
        <div className="search-tools">
          <button type="button" onClick={() => setPeriodOpen(true)}>
            <span>
              {period === '전체 기간' ? '전체' : period}{' '}
              {loading ? '…' : results.length}개
            </span>
            {chevron}
          </button>
          <div className="sort-selector">
            <button
              type="button"
              aria-expanded={sortOpen}
              aria-controls="calendar-sort-options"
              onClick={() => setSortOpen((open) => !open)}
            >
              <span>{sort}</span>
              {chevron}
            </button>
            {sortOpen && (
              <div
                className="sort-options"
                id="calendar-sort-options"
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setSortOpen(false);
                }}
              >
                {(['오래된순', '최신순'] as const).map((option) => (
                  <button
                    type="button"
                    key={option}
                    aria-pressed={sort === option}
                    onClick={() => {
                      setSort(option);
                      setSortOpen(false);
                    }}
                  >
                    <span>{option}</span>
                    <span aria-hidden="true">{sort === option ? '✓' : ''}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {!hasQuery ? (
          <ContentState
            title="검색어를 입력해주세요"
            description="찾고 싶은 캡슐, 아카이브, 기념일을 검색해보세요."
          />
        ) : (
          <QueryFeedback
            loading={loading}
            error={error}
            onRetry={refetch}
            empty={results.length === 0}
            emptyMessage="검색 결과가 없어요"
            emptyDescription="다른 검색어나 기간으로 다시 찾아보세요."
          />
        )}
        {!loading &&
          hasQuery &&
          !error &&
          (['capsule', 'anniversary', 'archive'] as const).map((type) => {
            const items = results.filter((item) => item.type === type);
            if (!items.length) return null;
            return (
              <section className="search-group" key={type}>
                <h2>
                  {type === 'capsule'
                    ? '타임캡슐'
                    : type === 'anniversary'
                      ? '기념일'
                      : '아카이브'}
                </h2>
                {items.map((item) => (
                  <CalendarCard key={item.id} item={item} />
                ))}
              </section>
            );
          })}
      </section>
      <BottomSheet
        open={periodOpen}
        onClose={() => setPeriodOpen(false)}
        title="언제 저장한 추억을 볼까요"
      >
        <div className="option-list">
          {['전체 기간', ...SEARCH_YEARS.map((year) => `${year}년`)].map(
            (option) => (
              <button
                type="button"
                key={option}
                onClick={() => {
                  setPeriod(option);
                  setPeriodOpen(false);
                }}
              >
                {option}
                <span>{period === option ? '✓' : ''}</span>
              </button>
            ),
          )}
        </div>
      </BottomSheet>
    </MobileLayout>
  );
}
