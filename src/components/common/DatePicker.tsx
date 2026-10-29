import { useState } from 'react';

import { formatKoreanDate, monthCells, parseKoreanDate } from '@/utils/dates';

export default function DatePicker({
  value,
  onCancel,
  onSelect,
}: {
  value?: string;
  onCancel: () => void;
  onSelect: (value: string) => void;
}) {
  const initial = parseKoreanDate(value ?? '') ?? new Date(2026, 7, 1);
  const [view, setView] = useState(
    new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
  const [day, setDay] = useState(initial.getDate());
  const year = view.getFullYear();
  const month = view.getMonth() + 1;
  const changeMonth = (offset: number) => {
    setView(new Date(year, month - 1 + offset, 1));
    setDay(1);
  };
  return (
    <div className="date-picker">
      <h2>
        <button
          type="button"
          aria-label="이전 달"
          onClick={() => changeMonth(-1)}
        >
          ‹
        </button>
        {year}년 {month}월
        <button
          type="button"
          aria-label="다음 달"
          onClick={() => changeMonth(1)}
        >
          ›
        </button>
      </h2>
      <div className="weekday-row">
        {'일월화수목금토'.split('').map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <div className="day-grid">
        {monthCells(year, month).map((cell, index) =>
          cell === null ? (
            <span key={`empty-${index}`} />
          ) : (
            <button
              type="button"
              key={cell}
              className={cell === day ? 'selected' : ''}
              onClick={() => setDay(cell)}
            >
              {cell}
            </button>
          ),
        )}
      </div>
      <div className="sheet-control">
        <button type="button" className="button-secondary" onClick={onCancel}>
          취소
        </button>
        <button
          type="button"
          className="button-primary"
          onClick={() =>
            onSelect(formatKoreanDate(new Date(year, month - 1, day)))
          }
        >
          선택
        </button>
      </div>
    </div>
  );
}
