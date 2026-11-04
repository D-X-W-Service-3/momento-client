import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchCapsuleListData } from '@/apis/capsules';
import { capsuleCoverPath } from '@/constants/routes';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { CapsuleFilterKey, CapsuleListItem } from '@/types/capsule';

export function useCapsuleList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get('filter');
  const selectedFilter: CapsuleFilterKey =
    param === 'locked'
      ? 'locked'
      : param === 'opened' || param === 'openable'
        ? 'opened'
        : 'editable';
  const shouldFocusSearch = searchParams.get('focus') === 'search';
  const [searchQuery, setSearchQuery] = useState('');
  const keyword = useDebouncedValue(searchQuery.trim());
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (shouldFocusSearch) searchInputRef.current?.focus();
  }, [shouldFocusSearch]);
  const query = useInfiniteQuery({
    queryKey: ['capsuleList', selectedFilter, keyword],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      fetchCapsuleListData(selectedFilter, keyword, pageParam),
    getNextPageParam: (last) =>
      last.hasNext && last.nextCursor ? last.nextCursor : undefined,
  });
  const groupedByYear = useMemo(() => {
    const groups: { year: number; items: CapsuleListItem[] }[] = [];
    const seen = new Set<string>();
    for (const item of query.data?.pages.flatMap((page) => page.items) ?? []) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      const group = groups.find((entry) => entry.year === item.year);
      if (group) group.items.push(item);
      else groups.push({ year: item.year, items: [item] });
    }
    return groups;
  }, [query.data]);
  return {
    filters: query.data?.pages[0].filters ?? [
      { key: 'editable' as const, label: '수정 가능', count: 0 },
      { key: 'locked' as const, label: '잠긴 캡슐', count: 0 },
      { key: 'opened' as const, label: '열린 캡슐', count: 0 },
    ],
    selectedFilter,
    searchQuery,
    searchInputRef,
    shouldFocusSearch,
    groupedByYear,
    isLoading: query.isLoading,
    error: query.error,
    retry: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    loadMore: () => query.fetchNextPage(),
    handleFilterChange: (filter: CapsuleFilterKey) =>
      setSearchParams({ filter }, { replace: true }),
    handleSearchChange: (event: ChangeEvent<HTMLInputElement>) =>
      setSearchQuery(event.target.value),
    handleNotifications: () => navigate('/notifications'),
    handleSelectCapsule: (id: string) => navigate(capsuleCoverPath(id)),
  };
}
