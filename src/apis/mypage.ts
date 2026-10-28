import defaultAvatarImg from '@/assets/images/default-avatar.png';
import type { MyPageData } from '@/types/mypage';

export const initialMyPageData: MyPageData = {
  profile: {
    name: '이상래',
    birthday: '2003.02.05',
    email: 'abc@gmail.com',
    phone: '010-8725-7221',
    avatarUrl: defaultAvatarImg,
    writtenLetterCount: 18,
  },
  activityStats: {
    totalCapsules: 10,
    beforeOpenCount: 18,
    openedCount: 28,
  },
  notificationSettings: [
    {
      key: 'openAlert',
      title: '개봉 알림',
      description: '예약한 타임캡슐이 열릴 때 알려드려요',
      enabled: true,
    },
    {
      key: 'dDayAlert',
      title: 'D-Day 알림',
      description: '개봉 7일 전부터 남은 날짜를 알려드려요',
      enabled: true,
    },
    {
      key: 'editDeadlineAlert',
      title: '수정 마감 알림',
      description: '수정 가능한 기간이 끝나기 전에 알려드려요',
      enabled: true,
    },
    {
      key: 'newParticipantAlert',
      title: '새 참여자 알림',
      description: '가족이 타임캡슐에 참여하면 알려드려요',
      enabled: false,
    },
    {
      key: 'memoryReplayAlert',
      title: '추억 다시보기',
      description: '지난 추억을 가끔 추천해드려요',
      enabled: true,
    },
  ],
};

export async function fetchMyPageData(): Promise<MyPageData> {
  return initialMyPageData;
}
