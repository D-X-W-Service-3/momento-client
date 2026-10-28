export type CapsuleFilterKey =
  'all' | 'openable' | 'editable' | 'locked' | 'opened';

export type CapsuleChipTone = 'openable' | 'editable' | 'locked' | 'opened';

export interface CapsuleChipBadge {
  label: string;
  tone: CapsuleChipTone;
}

export interface CapsuleFeaturedItem {
  id: string;
  statusLabel: string;
  dDayText: string;
  title: string;
  description: string;
  countText: string;
  openDateText: string;
}

export interface CapsuleHorizontalItem {
  id: string;
  badge: CapsuleChipBadge;
  title: string;
  openDateText: string;
}

export interface CapsuleListItem {
  id: string;
  year: number;
  filterCategory: Exclude<CapsuleFilterKey, 'all'>;
  variant: 'gradient' | 'white' | 'translucent';
  badges: CapsuleChipBadge[];
  title: string;
  description: string;
  dDayText?: string;
  dateText: string;
  countText: string;
}

export interface CapsuleFilterChipOption {
  key: CapsuleFilterKey;
  label: string;
  count: number;
}

export interface CapsuleHomeData {
  hasPendingRequest: boolean;
  featuredCapsules: CapsuleFeaturedItem[];
  editableCapsules: CapsuleHorizontalItem[];
  lockedCapsules: CapsuleHorizontalItem[];
  openedCapsules: CapsuleHorizontalItem[];
}

export interface CapsuleListData {
  filters: CapsuleFilterChipOption[];
  items: CapsuleListItem[];
}
