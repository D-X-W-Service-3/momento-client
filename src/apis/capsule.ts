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
  'featured-1': 'openable',
  'featured-2': 'openable',
  'featured-3': 'sealed',
  'featured-4': 'sealed',
  'edit-1': 'writing',
  'edit-2': 'writing',
  'edit-3': 'writing',
  'lock-1': 'sealed',
  'lock-2': 'sealed',
  'lock-3': 'sealed',
  'open-1': 'openable',
  'open-2': 'openable',
  'open-3': 'openable',
  'list-2026-1': 'openable',
  'list-2026-2': 'writing',
  'list-2027-1': 'sealed',
  'list-2027-2': 'writing',
  'list-2027-3': 'openable',
};

const MOCK_AVATARS = [avatar1, avatar2, avatar3, avatar4];
const MOCK_NAMES = [
  '상미',
  '민지',
  '지호',
  '민수',
  '현우',
  '유빈',
  '세영',
  '도윤',
  '하린',
  '준서',
  '예은',
  '시우',
];

const createMockMembers = (count: number): CapsuleMember[] =>
  Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    name: MOCK_NAMES[index % MOCK_NAMES.length],
    avatarUrl: MOCK_AVATARS[index % MOCK_AVATARS.length],
    isOwner: index === 0,
  }));

const MOCK_PARTICIPANTS = createMockMembers(8);
const MOCK_RECEIVERS = createMockMembers(12);

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
  participants: MOCK_PARTICIPANTS,
  participantCount: MOCK_PARTICIPANTS.length,
  receivers: MOCK_RECEIVERS,
  receiverCount: MOCK_RECEIVERS.length,
  isHost: true,
});

// TODO: 아이콘 세트가 나오면 교체. 지금은 같은 이미지를 Figma 의 점 개수(5개)만큼 둔다.
export const MOCK_CAPSULE_ICONS: CapsuleIconOption[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: `icon-${index + 1}`,
    imageUrl: capsuleHero,
  }),
);

export const getCapsuleIcons = async (): Promise<CapsuleIconOption[]> =>
  MOCK_CAPSULE_ICONS;
