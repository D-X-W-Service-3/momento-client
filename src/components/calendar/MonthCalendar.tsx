import { useEffect, useState } from 'react';

import CalendarPeriodGrid from '@/components/common/CalendarPeriodGrid';

import { monthCells } from '@/utils/dates';
import type { CalendarItem } from '@/types/momento';

const markerOrder: CalendarItem['type'][] = [
  'capsule',
  'anniversary',
  'archive',
];
const markerLabels: Record<CalendarItem['type'], string> = {
  capsule: '타임캡슐',
  anniversary: '기념일',
  archive: '아카이브',
};

type MonthCalendarProps = {
  year: number;
  month: number;
  selectedDay: number;
  markersByDay: Record<number, CalendarItem['type'][]>;
  onSelect: (day: number) => void;
  onChangeMonth: (offset: number) => void;
};

export default function MonthCalendar({
  selectedDay,
  year,
  month,
  markersByDay,
  onSelect,
  onChangeMonth,
}: MonthCalendarProps) {
  const days = monthCells(year, month);
  const today = new Date();
  const [mode, setMode] = useState<'day' | 'year' | 'month'>('day');
  const [yearPageStart, setYearPageStart] = useState(year - 4);
  const yearPageSize = 12;

  useEffect(() => {
    if (mode === 'day') return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMode('day');
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mode]);

  const handleHeaderNav = (offset: number) => {
    if (mode === 'year') {
      setYearPageStart((start) => start + offset * yearPageSize);
    } else {
      onChangeMonth(mode === 'month' ? offset * 12 : offset);
    }
  };
  const navigationUnit =
    mode === 'year' ? '12년' : mode === 'month' ? '해' : '달';

  return (
    <section className="month-calendar">
      <header>
        <div className="month-selector">
          <button
            type="button"
            className="month-trigger"
            aria-label="년도 선택"
            aria-expanded={mode === 'year'}
            aria-controls="calendar-period-options"
            onClick={() => {
              setYearPageStart(year - 4);
              setMode((current) => (current === 'year' ? 'day' : 'year'));
            }}
          >
            {year}년
          </button>
          <button
            type="button"
            className="month-trigger"
            aria-label="월 선택"
            aria-expanded={mode === 'month'}
            aria-controls="calendar-period-options"
            onClick={() =>
              setMode((current) => (current === 'month' ? 'day' : 'month'))
            }
          >
            {month}월
          </button>
        </div>
        <span className="month-actions">
          <button
            type="button"
            aria-label={`이전 ${navigationUnit}`}
            onClick={() => handleHeaderNav(-1)}
          >
            <span className="month-action-icon previous" aria-hidden="true">
              <img src="/assets/calendar/month-actions.svg" alt="" />
            </span>
          </button>
          <button
            type="button"
            aria-label={`다음 ${navigationUnit}`}
            onClick={() => handleHeaderNav(1)}
          >
            <span className="month-action-icon next" aria-hidden="true">
              <img src="/assets/calendar/month-actions.svg" alt="" />
            </span>
          </button>
        </span>
      </header>
      {mode === 'year' && (
        <CalendarPeriodGrid
          id="calendar-period-options"
          options={Array.from(
            { length: yearPageSize },
            (_, index) => yearPageStart + index,
          )}
          selected={year}
          suffix="년"
          onSelect={(selectedYear) => {
            if (selectedYear !== year)
              onChangeMonth((selectedYear - year) * 12);
            setMode('month');
          }}
        />
      )}
      {mode === 'month' && (
        <CalendarPeriodGrid
          id="calendar-period-options"
          options={Array.from({ length: 12 }, (_, index) => index + 1)}
          selected={month}
          suffix="월"
          onSelect={(selectedMonth) => {
            if (selectedMonth !== month) onChangeMonth(selectedMonth - month);
            setMode('day');
          }}
        />
      )}
      {mode === 'day' && (
        <>
          <div className="weekday-row">
            {'일월화수목금토'.split('').map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="day-grid month-grid">
            {days.map((day, index) =>
              day === null ? (
                <span key={`empty-${index}`} />
              ) : (
                <button
                  type="button"
                  key={day}
                  className={[
                    selectedDay === day && 'selected',
                    today.getFullYear() === year &&
                      today.getMonth() + 1 === month &&
                      today.getDate() === day &&
                      'today',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={
                    today.getFullYear() === year &&
                    today.getMonth() + 1 === month &&
                    today.getDate() === day
                      ? 'date'
                      : undefined
                  }
                  aria-pressed={selectedDay === day}
                  aria-label={`${day}일${markersByDay[day]?.length ? `, ${markersByDay[day].map((type) => markerLabels[type]).join(', ')} 기록 있음` : ''}`}
                  onClick={() => onSelect(day)}
                >
                  {day}
                  <span className="day-dots" aria-hidden="true">
                    {markerOrder
                      .filter((type) => markersByDay[day]?.includes(type))
                      .map((type) => (
                        <span className={`day-dot ${type}`} key={type} />
                      ))}
                  </span>
                </button>
              ),
            )}
          </div>
        </>
      )}
    </section>
  );
}
