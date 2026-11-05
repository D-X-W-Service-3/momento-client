import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import {
  createAnniversary,
  createMemory,
  deleteAnniversary,
  deleteMemory,
  dismissReceivedMemory,
  saveReceivedMemory,
  updateAnniversary,
  updateMemory,
  type MemoryInput,
} from '@/apis/momento';
import type { AnniversaryForm } from '@/types/momento';

const invalidateCalendar = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({
    predicate: ({ queryKey }) =>
      queryKey[0] === 'calendar' || queryKey[0] === 'calendar-search',
  });

export function useSaveMemory(archiveId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: MemoryInput) =>
      archiveId ? updateMemory(Number(archiveId), value) : createMemory(value),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['memories'] }),
        invalidateCalendar(queryClient),
        ...(archiveId
          ? [queryClient.invalidateQueries({ queryKey: ['memory', archiveId] })]
          : []),
      ]);
    },
  });
}

export function useDeleteMemory(archiveId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteMemory(Number(archiveId)),
    onSuccess: async () => {
      await queryClient.cancelQueries({
        queryKey: ['memory', archiveId],
        exact: true,
      });
      queryClient.removeQueries({
        queryKey: ['memory', archiveId],
        exact: true,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['memories'] }),
        invalidateCalendar(queryClient),
        queryClient.invalidateQueries({ queryKey: ['received-memories'] }),
      ]);
    },
  });
}

export function useSaveAnniversary(anniversaryId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AnniversaryForm) => {
      if (anniversaryId) await updateAnniversary(Number(anniversaryId), value);
      else await createAnniversary(value);
    },
    onSuccess: async () => {
      await Promise.all([
        invalidateCalendar(queryClient),
        ...(anniversaryId
          ? [
              queryClient.invalidateQueries({
                queryKey: ['anniversary', anniversaryId],
              }),
            ]
          : []),
      ]);
    },
  });
}

export function useDeleteAnniversary(anniversaryId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAnniversary(Number(anniversaryId)),
    onSuccess: async () => {
      await queryClient.cancelQueries({
        queryKey: ['anniversary', anniversaryId],
        exact: true,
      });
      queryClient.removeQueries({
        queryKey: ['anniversary', anniversaryId],
        exact: true,
      });
      await invalidateCalendar(queryClient);
    },
  });
}

export function useFinishReceivedMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: number; action: 'save' | 'dismiss' }) =>
      action === 'save' ? saveReceivedMemory(id) : dismissReceivedMemory(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['received-memories'] }),
        queryClient.invalidateQueries({ queryKey: ['memories'] }),
        invalidateCalendar(queryClient),
      ]);
    },
  });
}
