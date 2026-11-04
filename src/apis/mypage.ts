import { api } from '@/apis/client';
import type {
  MyPageData,
  NotificationSettingItem,
  NotificationSettingKey,
} from '@/types/mypage';
import { validateMemoryImages } from '@/utils/archivePhotos';

export interface MyProfileResponse {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  email: string | null;
  birthday: string | null;
  phoneNumber: string | null;
  activity: {
    totalCapsuleCount: number;
    beforeOpenCapsuleCount: number;
    openedCapsuleCount: number;
    writtenLetterCount: number;
  };
}
export interface ProfileUpdateRequest {
  nickname?: string;
  birthday?: string;
  email?: string;
  phoneNumber?: string;
  profileImageKey?: string;
}
export const fetchMyProfile = () => api.get<MyProfileResponse>('/v1/users/me');
export const updateMyProfile = (body: ProfileUpdateRequest) =>
  api.patch<MyProfileResponse>('/v1/users/me', body);
export const deleteMyAccount = () => api.delete<void>('/v1/users/me');
export const checkNickname = (nickname: string) =>
  api.get<{ nickname: string; available: boolean }>(
    `/v1/users/nickname/availability?nickname=${encodeURIComponent(nickname)}`,
  );
export function toMyPageData(
  data: MyProfileResponse,
): Omit<MyPageData, 'notificationSettings'> {
  return {
    profile: {
      name: data.nickname,
      birthday: data.birthday ?? '',
      email: data.email ?? '',
      phone: data.phoneNumber ?? '',
      avatarUrl: data.profileImageUrl,
      writtenLetterCount: data.activity.writtenLetterCount,
    },
    activityStats: {
      totalCapsules: data.activity.totalCapsuleCount,
      beforeOpenCount: data.activity.beforeOpenCapsuleCount,
      openedCount: data.activity.openedCapsuleCount,
    },
  };
}
type NotificationSettingsResponse = {
  capsuleOpened: boolean;
  capsuleDDay: boolean;
  letterDeadline: boolean;
  newMember: boolean;
  memoryReminder: boolean;
};
export const notificationSettingFields: Record<
  NotificationSettingKey,
  keyof NotificationSettingsResponse
> = {
  openAlert: 'capsuleOpened',
  dDayAlert: 'capsuleDDay',
  editDeadlineAlert: 'letterDeadline',
  newParticipantAlert: 'newMember',
  memoryReplayAlert: 'memoryReminder',
};
const settingLabels: {
  key: NotificationSettingKey;
  title: string;
  description: string;
}[] = [
  {
    key: 'openAlert',
    title: '개봉 알림',
    description: '예약한 타임캡슐이 열릴 때 알려드려요',
  },
  {
    key: 'dDayAlert',
    title: 'D-Day 알림',
    description: '개봉 7일 전부터 남은 날짜를 알려드려요',
  },
  {
    key: 'editDeadlineAlert',
    title: '수정 마감 알림',
    description: '수정 가능한 기간이 끝나기 전에 알려드려요',
  },
  {
    key: 'newParticipantAlert',
    title: '새 참여자 알림',
    description: '새 참여자가 타임캡슐에 참여하면 알려드려요',
  },
  {
    key: 'memoryReplayAlert',
    title: '추억 다시보기',
    description: '지난 추억을 가끔 추천해드려요',
  },
];
export async function fetchNotificationSettings(): Promise<
  NotificationSettingItem[]
> {
  const data = await api.get<NotificationSettingsResponse>(
    '/v1/users/me/notification-settings',
  );
  return settingLabels.map((item) => ({
    ...item,
    enabled: data[notificationSettingFields[item.key]],
  }));
}
export const updateNotificationSetting = ({
  key,
  enabled,
}: {
  key: NotificationSettingKey;
  enabled: boolean;
}) =>
  api.patch<void>('/v1/users/me/notification-settings', {
    [notificationSettingFields[key]]: enabled,
  });

export async function uploadProfileImage(file: File) {
  validateMemoryImages([file]);
  const data = await api.post<{
    uploads: { imageKey: string; uploadUrl: string }[];
  }>('/v1/images/presigned-urls', {
    target: 'PROFILE',
    files: [{ contentType: file.type, contentLength: file.size }],
  });
  const upload = data.uploads[0];
  if (data.uploads.length !== 1 || !upload?.imageKey || !upload.uploadUrl)
    throw new Error('사진 업로드 정보를 확인할 수 없어요.');
  const response = await fetch(upload.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!response.ok)
    throw new Error('사진 업로드에 실패했어요. 다시 시도해 주세요.');
  return upload.imageKey;
}
