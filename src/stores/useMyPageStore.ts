import { create } from 'zustand';

import { initialMyPageData } from '@/apis/mypage';
import type {
  ActivitySummaryStats,
  MyPageProfile,
  NotificationSettingItem,
  NotificationSettingKey,
} from '@/types/mypage';

interface MyPageState {
  profile: MyPageProfile;
  activityStats: ActivitySummaryStats;
  notificationSettings: NotificationSettingItem[];
  updateProfile: (updates: Partial<MyPageProfile>) => void;
  toggleNotificationSetting: (key: NotificationSettingKey) => void;
}

export const useMyPageStore = create<MyPageState>((set) => ({
  profile: initialMyPageData.profile,
  activityStats: initialMyPageData.activityStats,
  notificationSettings: initialMyPageData.notificationSettings,
  updateProfile: (updates) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...updates,
      },
    })),
  toggleNotificationSetting: (key) =>
    set((state) => ({
      notificationSettings: state.notificationSettings.map((item) =>
        item.key === key ? { ...item, enabled: !item.enabled } : item,
      ),
    })),
}));
