export function parseKoreanDate(value: string): Date | null {
  const match = value.match(
    /(\d{4})(?:년\s*|-)(\d{1,2})(?:월\s*|-)(\d{1,2})(?:일)?/,
  );
  if (!match) return null;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatKoreanDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function monthCells(year: number, month: number): (number | null)[] {
  const offset = new Date(year, month - 1, 1).getDay();
  const count = new Date(year, month, 0).getDate();
  return [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: count }, (_, index) => index + 1),
  ];
}

export function sameDay(
  value: string,
  year: number,
  month: number,
  day: number,
  yearly = false,
): boolean {
  const date = parseKoreanDate(value);
  return Boolean(
    date &&
    (yearly || date.getFullYear() === year) &&
    date.getMonth() + 1 === month &&
    date.getDate() === day,
  );
}

export function daysUntil(value: string, yearly = false): string {
  const date = parseKoreanDate(value);
  if (!date) return '';
  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const target = yearly
    ? new Date(today.getFullYear(), date.getMonth(), date.getDate())
    : date;
  if (yearly && target < start) target.setFullYear(target.getFullYear() + 1);
  const days = Math.round((target.getTime() - start.getTime()) / 86_400_000);
  return days === 0 ? 'D-DAY' : days > 0 ? `D-${days}` : `D+${-days}`;
}

/** '오후 3:15' → { hours: 15, minutes: 15 } (24시간제) */
export function parseKoreanTime(
  value: string,
): { hours: number; minutes: number } | null {
  const match = /^(오전|오후)\s+(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour12 = Number(match[2]);
  const minutes = Number(match[3]);
  if (hour12 < 1 || hour12 > 12 || minutes > 59) return null;
  return {
    hours: (hour12 % 12) + (match[1] === '오후' ? 12 : 0),
    minutes,
  };
}

/** 24시간제 시·분 → '오후 3:15' */
export function formatKoreanTime(hours: number, minutes: number): string {
  return `${hours >= 12 ? '오후' : '오전'} ${hours % 12 || 12}:${String(minutes).padStart(2, '0')}`;
}

/** '2026년 11월 20일' + '오후 3:15' → Date (로컬 시각) */
export function combineKoreanDateTime(date: string, time: string): Date | null {
  const day = parseKoreanDate(date);
  const parsed = parseKoreanTime(time);
  if (!day || !parsed) return null;
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    parsed.hours,
    parsed.minutes,
  );
}

/** Date → 서버 LocalDateTime 형식 '2026-11-20T15:15' (오프셋 없음) */
export function toLocalDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
