import { useEffect, useRef, useState } from 'react';

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
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (monthMenuOpen && optionsRef.current)
      optionsRef.current.scrollTop = Math.max(0, (month - 1) * 40 - 80);
  }, [monthMenuOpen, month]);

  useEffect(() => {
    if (!monthMenuOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!selectorRef.current?.contains(event.target as Node))
        setMonthMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMonthMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [monthMenuOpen]);

  return (
    <section className="month-calendar">
      <header>
        <div className="month-selector" ref={selectorRef}>
          <button
            type="button"
            className="month-trigger"
            aria-expanded={monthMenuOpen}
            aria-controls="calendar-month-options"
            onClick={() => setMonthMenuOpen((open) => !open)}
          >
            {month}월
            <span className="month-chevron" aria-hidden="true">
              <img src="/assets/calendar/month-chevron.svg" alt="" />
            </span>
          </button>
          {monthMenuOpen && (
            <div
              className="month-options"
              id="calendar-month-options"
              ref={optionsRef}
              role="group"
              aria-label={`${year}년 월 선택`}
            >
              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (option) => (
                  <button
                    type="button"
                    key={option}
                    className={option === month ? 'active' : ''}
                    aria-pressed={option === month}
                    onClick={() => {
                      if (option !== month) onChangeMonth(option - month);
                      setMonthMenuOpen(false);
                    }}
                  >
                    {option}월
                    {option === month && <span aria-hidden="true">✓</span>}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
        <span>
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => {
              setMonthMenuOpen(false);
              onChangeMonth(-1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => {
              setMonthMenuOpen(false);
              onChangeMonth(1);
            }}
          >
            ›
          </button>
        </span>
      </header>
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
    </section>
  );
}
