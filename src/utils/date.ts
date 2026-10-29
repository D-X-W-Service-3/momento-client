import dayjs, { type Dayjs } from 'dayjs';

export const DATE_KEY_FORMAT = 'YYYY-MM-DD';

export const toDateKey = (date: Dayjs) => date.format(DATE_KEY_FORMAT);

/** 2026년 8월 12일 */
export const formatKoreanDate = (date: string | Dayjs) =>
  dayjs(date).format('YYYY년 M월 D일');

/** 2026.08.12 */
export const formatDotDate = (date: string | Dayjs) =>
  dayjs(date).format('YYYY.MM.DD');

/**
 * 해당 월의 달력 그리드. 주 단위(일~토) 행으로 나누고, 이번 달이 아닌 칸은 null.
 */
export const getMonthGrid = (month: Dayjs): (Dayjs | null)[][] => {
  const firstDay = month.startOf('month');
  const cells: (Dayjs | null)[] = [
    ...Array.from({ length: firstDay.day() }, () => null),
    ...Array.from({ length: firstDay.daysInMonth() }, (_, i) =>
      firstDay.add(i, 'day'),
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return Array.from({ length: cells.length / 7 }, (_, row) =>
    cells.slice(row * 7, row * 7 + 7),
  );
};

/** 개봉일까지 남은 일수. 0 이면 당일, 음수면 지난 날. */
export const getDDay = (openDate: string, today: Dayjs = dayjs()) =>
  dayjs(openDate).startOf('day').diff(today.startOf('day'), 'day');
