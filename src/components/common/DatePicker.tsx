import dayjs from 'dayjs';

import chevronPrevNextIcon from '@/assets/icons/chevron-prev-next.svg';
import chevronUpIcon from '@/assets/icons/chevron-up.svg';
import type { CalendarMonthEntries } from '@/types/calendar';
import { getMonthGrid, toDateKey } from '@/utils/date';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface DatePickerProps {
  /** YYYY-MM */
  month: string;
  /** YYYY-MM-DD */
  selectedDate: string;
  entries?: CalendarMonthEntries;
  onSelectDate: (date: string) => void;
  onMoveMonth: (offset: number) => void;
}

export default function DatePicker({
  month,
  selectedDate,
  entries,
  onSelectDate,
  onMoveMonth,
}: DatePickerProps) {
  const today = dayjs().startOf('day');
  const viewMonth = dayjs(month);
  const grid = getMonthGrid(viewMonth);

  return (
    <section className="flex w-full flex-col gap-4 rounded-lg bg-surface p-card shadow-card">
      <header className="flex items-center justify-between">
        <h2 className="flex items-center gap-[5px] text-title-md font-bold text-ink">
          {viewMonth.month() + 1}월
          <img
            src={chevronUpIcon}
            alt=""
            className="h-[6.375px] w-[10.75px] rotate-180"
          />
        </h2>
        {/* 이전/다음 화살표가 한 장의 에셋이라 좌우 절반에 버튼을 겹친다. */}
        <div className="relative h-[11.6px] w-[43.6px]">
          <img src={chevronPrevNextIcon} alt="" className="size-full" />
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => onMoveMonth(-1)}
            className="absolute -inset-y-3 -left-3 right-1/2"
          />
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => onMoveMonth(1)}
            className="absolute -inset-y-3 left-1/2 -right-3"
          />
        </div>
      </header>

      <div className="flex">
        {WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            className="flex h-6 flex-1 items-center justify-center text-label font-medium text-ink-faint"
          >
            {weekday}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {grid.map((week, row) => (
          <div key={row} className="flex">
            {week.map((date, col) => {
              if (!date) return <div key={col} className="h-10 flex-1" />;

              const key = toDateKey(date);
              const entry = entries?.[key];
              const isSelected = key === selectedDate;
              const isToday = date.isSame(today, 'day');
              const isPast = date.isBefore(today, 'day');

              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={date.format('M월 D일')}
                  onClick={() => onSelectDate(key)}
                  className="flex h-10 flex-1 flex-col items-center justify-center gap-[5px]"
                >
                  <span
                    className={`flex size-[22px] items-center justify-center rounded-full text-body-sm ${
                      isSelected
                        ? 'bg-primary text-on-primary'
                        : isToday
                          ? 'border border-primary text-ink'
                          : isPast
                            ? 'text-ink-disabled'
                            : 'text-ink'
                    }`}
                  >
                    {date.date()}
                  </span>
                  {/* 보라: 타임캡슐, 코랄: 아카이브 */}
                  <span className="flex h-[5px] gap-[3px]">
                    {!!entry?.capsules.length && (
                      <span className="size-[5px] rounded-full bg-primary" />
                    )}
                    {!!entry?.archives.length && (
                      <span className="size-[5px] rounded-full bg-secondary" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
