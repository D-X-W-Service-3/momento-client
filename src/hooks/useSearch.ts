import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { searchMemories } from '@/apis/search';

export const useSearchMemories = (keyword: string) =>
  useQuery({
    queryKey: ['search', keyword.trim()],
    queryFn: () => searchMemories(keyword),
    placeholderData: keepPreviousData,
  });
