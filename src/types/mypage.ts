export interface MyPageProfile {
  name: string;
  birthday: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  writtenLetterCount: number;
}

export interface ActivitySummaryStats {
  totalCapsules: number;
  beforeOpenCount: number;
  openedCount: number;
}

export type NotificationSettingKey =
  | 'openAlert'
  | 'dDayAlert'
  | 'editDeadlineAlert'
  | 'newParticipantAlert'
  | 'memoryReplayAlert';

export interface NotificationSettingItem {
  key: NotificationSettingKey;
  title: string;
  description: string;
  enabled: boolean;
}

export interface MyPageData {
  profile: MyPageProfile;
  activityStats: ActivitySummaryStats;
  notificationSettings: NotificationSettingItem[];
}
