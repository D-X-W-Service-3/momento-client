export function parseKoreanDate(value: string): Date | null {
  const match = value.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
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
