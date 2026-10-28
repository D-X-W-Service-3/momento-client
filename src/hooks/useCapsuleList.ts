import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { fetchCapsuleListData } from '@/apis/capsules';
import type { CapsuleFilterKey, CapsuleListItem } from '@/types/capsule';

const VALID_FILTERS: CapsuleFilterKey[] = [
  'all',
  'openable',
  'editable',
  'locked',
  'opened',
];

export function useCapsuleList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramFilter = searchParams.get('filter') as CapsuleFilterKey | null;
  const shouldFocusSearch = searchParams.get('focus') === 'search';
  const initialFilter: CapsuleFilterKey =
    paramFilter && VALID_FILTERS.includes(paramFilter) ? paramFilter : 'all';

  const [selectedFilter, setSelectedFilter] =
    useState<CapsuleFilterKey>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (shouldFocusSearch) {
      searchInputRef.current?.focus();
    }
  }, [shouldFocusSearch]);

  const query = useQuery({
    queryKey: ['capsuleList'],
    queryFn: fetchCapsuleListData,
  });

  const groupedByYear = useMemo(() => {
    const items = query.data?.items ?? [];
    const trimmed = searchQuery.trim().toLowerCase();

    const filtered = items.filter((item) => {
      const matchesFilter =
        selectedFilter === 'all' || item.filterCategory === selectedFilter;
      const matchesQuery =
        !trimmed ||
        `${item.title} ${item.description}`.toLowerCase().includes(trimmed);
      return matchesFilter && matchesQuery;
    });

    const groups: { year: number; items: CapsuleListItem[] }[] = [];
    for (const item of filtered) {
      const existing = groups.find((g) => g.year === item.year);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.push({ year: item.year, items: [item] });
      }
    }
    return groups;
  }, [query.data?.items, selectedFilter, searchQuery]);

  const handleFilterChange = (filter: CapsuleFilterKey) => {
    setSelectedFilter(filter);
    const nextParams: Record<string, string> = {};
    if (filter !== 'all') {
      nextParams.filter = filter;
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  return {
    filters: query.data?.filters ?? [],
    selectedFilter,
    searchQuery,
    searchInputRef,
    shouldFocusSearch,
    groupedByYear,
    handleFilterChange,
    handleSearchChange,
    handleNotifications,
  };
}
