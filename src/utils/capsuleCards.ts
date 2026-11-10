import type {
  CapsuleCardResponse,
  CapsuleFilterKey,
  CapsuleListItem,
  CapsuleChipBadge,
} from '@/types/capsule';
import { capsuleStatusChip } from '@/utils/capsule';

export const capsuleStatusParam: Record<
  Exclude<CapsuleFilterKey, 'all'>,
  string
> = {
  editable: 'WRITING',
  locked: 'LOCKED',
  opened: 'OPENED',
};

export const dDayLabel = (days: number) =>
  days === 0 ? 'D-DAY' : days > 0 ? `D-${days}` : `D+${-days}`;

// 서버의 날짜 없는 타임존은 한국 시간으로 해석한다.
export const serverDate = (value: string) =>
  new Date(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : `${value}+09:00`);
/**
 * 개봉까지 남은 시간 문구. 하루 미만이면 시간·분 단위로 센다.
 * 예: '3일 후에', '5시간 후에', '12분 후에', '잠시 후에'
 */
export const openCountdownLabel = (
  openAt: string,
  dDay: number,
  now = Date.now(),
) => {
  const remaining = serverDate(openAt).getTime() - now;
  const HOUR = 60 * 60 * 1000;
  if (remaining >= 24 * HOUR) return `${Math.max(1, dDay)}일 후에`;
  if (remaining >= HOUR) return `${Math.floor(remaining / HOUR)}시간 후에`;
  if (remaining >= 60 * 1000)
    return `${Math.floor(remaining / (60 * 1000))}분 후에`;
  return '잠시 후에';
};

export const capsuleDateLabel = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return `${year}년 ${month}월 ${day}일 개봉`;
};
type CapsuleBadgeSource = Pick<CapsuleCardResponse, 'status' | 'openedByMe'>;

export const capsuleBadge = (card: CapsuleBadgeSource): CapsuleChipBadge => ({
  label:
    card.status === 'WRITING'
      ? '수정 가능'
      : card.status === 'LOCKED'
        ? '잠긴 캡슐'
        : card.openedByMe
          ? '개봉됨'
          : '개봉 가능',
  tone:
    card.status === 'WRITING'
      ? 'info'
      : card.status === 'LOCKED'
        ? 'neutral'
        : 'success',
});

/** 타임캡슐 홈·목록 카드는 개봉 D-day와 별도로 수정 마감 D-day를 보여준다. */
export const capsuleDeadlineBadge = (
  card: CapsuleBadgeSource & Pick<CapsuleCardResponse, 'deadlineDDay'>,
): CapsuleChipBadge => {
  if (card.status !== 'WRITING') return capsuleBadge(card);
  const days = card.deadlineDDay;
  return {
    label:
      days == null
        ? '수정 가능'
        : days < 0
          ? '수정마감 종료'
          : `수정마감 ${dDayLabel(days)}`,
    tone: 'warning',
  };
};
export const capsuleCountLabel = (card: CapsuleCardResponse) =>
  `${card.memberCount}명 | 편지 ${card.letterCount}`;
export function toCapsuleListItem(card: CapsuleCardResponse): CapsuleListItem {
  const { label, tone } =
    card.status === 'OPENED' && card.openedByMe
      ? capsuleStatusChip(card.status)
      : capsuleDeadlineBadge(card);

  return {
    id: String(card.capsuleId),
    year: Number(card.openAt.slice(0, 4)),
    filterCategory:
      card.status === 'WRITING'
        ? 'editable'
        : card.status === 'LOCKED'
          ? 'locked'
          : 'opened',
    variant:
      card.status === 'OPENED' && !card.openedByMe
        ? 'gradient'
        : card.status === 'LOCKED'
          ? 'translucent'
          : 'white',
    badges: [{ label, tone }],
    title: card.title,
    description: card.description ?? '',
    dDayText: dDayLabel(card.dDay),
    dateText: capsuleDateLabel(card.openAt),
    countText: capsuleCountLabel(card),
  };
}
