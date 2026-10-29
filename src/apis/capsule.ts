import dayjs from 'dayjs';

import capsuleHero from '@/assets/images/capsule/capsule-hero.webp';
import avatar1 from '@/assets/images/mock/avatar-1.webp';
import avatar2 from '@/assets/images/mock/avatar-2.webp';
import avatar3 from '@/assets/images/mock/avatar-3.webp';
import avatar4 from '@/assets/images/mock/avatar-4.webp';
import type { CapsuleStatus } from '@/types/calendar';
import type {
  CapsuleCover,
  CapsuleDetail,
  CapsuleIconOption,
  CapsuleMember,
} from '@/types/capsule';
import { toDateKey } from '@/utils/date';

// TODO: 백엔드 API 확정 후 axios 호출로 교체.
// 그 전까지는 id 로 상태를 바꿔 세 가지 커버를 모두 확인할 수 있게 한다.
const MOCK_STATUS_BY_ID: Record<string, CapsuleStatus> = {
  sealed: 'sealed',
  openable: 'openable',
};

const MOCK_MEMBERS: CapsuleMember[] = [
  { id: '1', name: '상미', avatarUrl: avatar1 },
  { id: '2', name: '민지', avatarUrl: avatar2 },
  { id: '3', name: '지호', avatarUrl: avatar3 },
  { id: '4', name: '민수', avatarUrl: avatar2 },
  { id: '5', name: '현우', avatarUrl: avatar4 },
];

const createMockCover = (id: string): CapsuleCover => ({
  id,
  title: '2024 우리, 다시 만나는 날',
  status: MOCK_STATUS_BY_ID[id] ?? 'writing',
  openDate: toDateKey(dayjs().add(136, 'day')),
});

export const getCapsuleCover = async (id: string): Promise<CapsuleCover> =>
  createMockCover(id);

export const getCapsuleDetail = async (id: string): Promise<CapsuleDetail> => ({
  ...createMockCover(id),
  description: '1년 동안 서로에게 응원과 사랑을 보냈던\n우리의 소중한 타임캡슐',
  isGroup: true,
  coverImageUrl: capsuleHero,
  memberCount: 5,
  letterCount: 13,
  participants: MOCK_MEMBERS,
  participantCount: 12,
  receivers: MOCK_MEMBERS,
  receiverCount: 12,
  isHost: true,
});

// TODO: 아이콘 세트가 나오면 교체. 지금은 같은 이미지를 Figma 의 점 개수(5개)만큼 둔다.
export const getCapsuleIcons = async (): Promise<CapsuleIconOption[]> =>
  Array.from({ length: 5 }, (_, index) => ({
    id: `icon-${index + 1}`,
    imageUrl: capsuleHero,
  }));
