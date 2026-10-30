import { useNavigate } from 'react-router-dom';

import { useMyPageStore } from '@/stores/useMyPageStore';
import type { NotificationSettingKey } from '@/types/mypage';

export function useNotificationSettings() {
  const navigate = useNavigate();
  const notificationSettings = useMyPageStore(
    (state) => state.notificationSettings,
  );
  const toggleNotificationSetting = useMyPageStore(
    (state) => state.toggleNotificationSetting,
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggle = (key: NotificationSettingKey) => {
    toggleNotificationSetting(key);
  };

  return {
    notificationSettings,
    handleBack,
    handleToggle,
  };
}
