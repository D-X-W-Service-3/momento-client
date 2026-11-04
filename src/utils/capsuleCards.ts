import type {
  CapsuleCardResponse,
  CapsuleFilterKey,
  CapsuleListItem,
  CapsuleChipBadge,
} from '@/types/capsule';

export const capsuleStatusParam: Record<CapsuleFilterKey, string> = {
  editable: 'WRITING',
  locked: 'LOCKED',
  opened: 'OPENED',
};

export const dDayLabel = (days: number) =>
  days === 0 ? 'D-DAY' : days > 0 ? `D-${days}` : `D+${-days}`;

// 서버의 날짜 없는 타임존은 한국 시간으로 해석한다.
export const serverDate = (value: string) =>
  new Date(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : `${value}+09:00`);
export const capsuleDateLabel = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return `${year}년 ${month}월 ${day}일 개봉`;
};
export const capsuleBadge = (card: CapsuleCardResponse): CapsuleChipBadge => ({
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
export const capsuleCountLabel = (card: CapsuleCardResponse) =>
  `${card.memberCount}명 | 편지 ${card.letterCount}`;
export function toCapsuleListItem(card: CapsuleCardResponse): CapsuleListItem {
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
    badges: [capsuleBadge(card)],
    title: card.title,
    description: card.description ?? '',
    dDayText: dDayLabel(card.dDay),
    dateText: capsuleDateLabel(card.openAt),
    countText: capsuleCountLabel(card),
  };
}
