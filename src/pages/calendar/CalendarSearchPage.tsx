import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import BottomSheet from '@/components/common/BottomSheet';
import { SearchIcon } from '@/components/common/Icons';
import CalendarCard from '@/components/calendar/CalendarCards';
import { BackHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import { searchCalendar, toCalendarItems } from '@/apis/momento';
import type { CalendarItem } from '@/types/momento';

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
  const { data, error } = useQuery({
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
  return (
    <MobileLayout>
      <BackHeader title="검색" />
      <section className="search-page">
        {error && (
          <p className="field-error" role="alert">
            {error.message}
          </p>
        )}
        <label className="search-field">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="캡슐 및 아카이브, 기념일 검색"
          />
          <SearchIcon />
        </label>
        <div className="search-tools">
          <button type="button" onClick={() => setPeriodOpen(true)}>
            {period === '전체 기간' ? '전체' : period} {results.length}개⌄
          </button>
          <div className="sort-selector">
            <button
              type="button"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((open) => !open)}
            >
              {sort}⌄
            </button>
            {sortOpen && (
              <div className="sort-options">
                {(['오래된순', '최신순'] as const).map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => {
                      setSort(option);
                      setSortOpen(false);
                    }}
                  >
                    {option}
                    {sort === option && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {(['capsule', 'anniversary', 'archive'] as const).map((type) => {
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
        {results.length === 0 && (
          <p className="empty-state">검색 결과가 없어요.</p>
        )}
      </section>
      <BottomSheet
        open={periodOpen}
        onClose={() => setPeriodOpen(false)}
        title="언제 저장한 추억을 볼까요"
      >
        <div className="option-list">
          {['전체 기간', '2026년', '2027년', '2028년', '2029년'].map(
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
