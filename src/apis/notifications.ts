import type { NotificationItem } from '@/types/notification';

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: '유빈님이 캡슐에 초대했어요',
    description: '우리들의 추억여행 타임캡슐을 함께 제작해보세요',
    dateLabel: '오늘',
  },
  {
    id: '2',
    title: '타임캡슐이 공개되었어요',
    description: '지금바로 확인해보세요',
    dateLabel: '오늘',
  },
  {
    id: '3',
    title: '유빈님이 아카이브를 공유했어요',
    description: '어떤 아카이브인지 확인해보세요',
    dateLabel: '오늘',
  },
  {
    id: '4',
    title: '새로운 편지가 추가되었어요',
    description: '졸업기념 캡슐에 새 편지가 추가되었어요',
    dateLabel: '오늘',
  },
  {
    id: '5',
    title: '캡슐 개봉 3일 전이에요',
    description: '어떤 캡슐인지 확인해보세요',
    dateLabel: '오늘',
  },
];

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return Promise.resolve(MOCK_NOTIFICATIONS);
}
