import { useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotificationSettings,
  updateNotificationSetting,
} from '@/apis/mypage';
import type {
  NotificationSettingItem,
  NotificationSettingKey,
} from '@/types/mypage';
export function useNotificationSettings() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const saving = useRef(false);
  const key = ['notificationSettings'];
  const query = useQuery({ queryKey: key, queryFn: fetchNotificationSettings });
  const mutation = useMutation({
    mutationFn: updateNotificationSetting,
    onMutate: async (value) => {
      saving.current = true;
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<NotificationSettingItem[]>(key);
      client.setQueryData<NotificationSettingItem[]>(key, (items) =>
        items?.map((item) =>
          item.key === value.key ? { ...item, enabled: value.enabled } : item,
        ),
      );
      return previous;
    },
    onError: (_error, _value, previous) => {
      if (previous) client.setQueryData(key, previous);
    },
    onSettled: async () => {
      try {
        await client.invalidateQueries({ queryKey: key });
      } finally {
        saving.current = false;
      }
    },
  });
  return {
    notificationSettings: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ?? mutation.error,
    retry: query.refetch,
    isSaving: mutation.isPending,
    handleBack: () => navigate(-1),
    handleToggle: (setting: NotificationSettingKey) => {
      const item = query.data?.find((entry) => entry.key === setting);
      if (item && !saving.current && !mutation.isPending) {
        saving.current = true;
        mutation.mutate({ key: setting, enabled: !item.enabled });
      }
    },
  };
}
