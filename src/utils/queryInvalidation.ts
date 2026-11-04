import type { QueryClient } from '@tanstack/react-query';

const capsuleKeys = new Set([
  'capsule',
  'capsuleHome',
  'capsuleList',
  'homeDashboard',
  'myProfile',
  'calendar',
  'calendar-search',
  'receivedInvites',
]);
export const invalidateCapsuleQueries = (client: QueryClient) =>
  client.invalidateQueries({
    predicate: (query) => capsuleKeys.has(String(query.queryKey[0])),
  });
