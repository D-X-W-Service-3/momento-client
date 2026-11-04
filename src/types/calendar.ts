export type CapsuleStatus = 'openable' | 'sealed' | 'writing';

export interface CapsuleSummary {
  id: string;
  title: string;
  /** 개봉일 (YYYY-MM-DD) */
  openDate: string;
  status: CapsuleStatus;
  memberCount: number;
  letterCount: number;
}

export interface ArchiveSummary {
  id: string;
  title: string;
  /** 기록일 (YYYY-MM-DD) */
  date: string;
  photoCount: number;
  authorName: string;
  thumbnailUrl: string;
}

/** 하루 단위 캘린더 항목 */
export interface CalendarDayEntry {
  capsules: CapsuleSummary[];
  archives: ArchiveSummary[];
}

/** key: YYYY-MM-DD */
export type CalendarMonthEntries = Record<string, CalendarDayEntry>;

export interface CalendarCounts {
  all: number;
  capsule: number;
  archive: number;
}

export type CalendarFilter = keyof CalendarCounts;
