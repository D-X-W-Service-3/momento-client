import { api } from '@/apis/client';
import type {
  CapsuleFilterKey,
  CapsuleHomeData,
  CapsuleListData,
  CapsuleListResponse,
  CapsuleOverviewResponse,
  ReceivedInvite,
} from '@/types/capsule';
import {
  capsuleDeadlineBadge,
  capsuleCountLabel,
  capsuleDateLabel,
  capsuleStatusParam,
  dDayLabel,
  toCapsuleListItem,
} from '@/utils/capsuleCards';

export async function fetchCapsuleHomeData(): Promise<CapsuleHomeData> {
  const data = await api.get<CapsuleOverviewResponse>(
    '/v1/time-capsules/overview',
  );
  const horizontal = (cards: CapsuleOverviewResponse['writing']) =>
    cards.map((card) => ({
      id: String(card.capsuleId),
      iconType: card.iconType,
      badge: capsuleDeadlineBadge(card),
      title: card.title,
      openDateText: capsuleDateLabel(card.openAt),
    }));
  return {
    hasPendingRequest: data.hasPendingInvite,
    featuredCapsules: data.upcoming.map((card) => ({
      id: String(card.capsuleId),
      statusLabel: capsuleDeadlineBadge(card).label,
      dDayText: dDayLabel(card.dDay),
      title: card.title,
      description: card.description ?? '',
      countText: capsuleCountLabel(card),
      openDateText: capsuleDateLabel(card.openAt),
    })),
    editableCapsules: horizontal(data.writing),
    lockedCapsules: horizontal(data.locked),
    openedCapsules: horizontal(data.opened),
  };
}

export async function fetchCapsuleListData(
  filter: CapsuleFilterKey,
  keyword: string,
  cursor?: string,
): Promise<CapsuleListData> {
  const params = new URLSearchParams({ size: '20' });
  if (filter !== 'all') params.set('status', capsuleStatusParam[filter]);
  if (keyword) params.set('keyword', keyword);
  if (cursor) params.set('cursor', cursor);
  const data = await api.get<CapsuleListResponse>(
    `/v1/time-capsules?${params}`,
  );
  return {
    filters: [
      { key: 'all', label: '전체', count: data.counts.all },
      { key: 'editable', label: '수정 가능', count: data.counts.writing },
      { key: 'locked', label: '잠긴 캡슐', count: data.counts.locked },
      { key: 'opened', label: '열린 캡슐', count: data.counts.opened },
    ],
    items: data.capsules.map(toCapsuleListItem),
    nextCursor: data.nextCursor,
    hasNext: data.hasNext,
  };
}

export const fetchReceivedInvites = () =>
  api.get<{ invites: ReceivedInvite[] }>('/v1/invites/received');
export interface CreateCapsuleRequest {
  iconType: string;
  title: string;
  description: string;
  capsuleType: 'SELF' | 'FRIEND' | 'GROUP';
  visibilityType: 'RECIPIENT_AND_AUTHOR' | 'ALL_MEMBERS';
  /** 한국 시간 LocalDateTime, 분 단위 ('2026-11-20T15:00') */
  letterDeadlineAt: string;
  openAt: string;
}
export const createCapsule = (body: CreateCapsuleRequest) =>
  api.post<{ capsuleId: number }>('/v1/time-capsules', body);
