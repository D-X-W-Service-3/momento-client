import { useState } from 'react';

import { textStyles } from '@/styles/tokens';
import { formatKoreanDate, monthCells, parseKoreanDate } from '@/utils/dates';

interface DatePickerProps {
  value?: string;
  onCancel: () => void;
  onSelect: (value: string) => void;
  minDate?: Date;
}

export default function DatePicker({
  value,
  onCancel,
  onSelect,
  minDate,
}: DatePickerProps) {
  const normalizedMin = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : null;

  const parsedValue = parseKoreanDate(value ?? '');
  const fallbackDate = normalizedMin ?? new Date();
  const initial =
    parsedValue && (!normalizedMin || parsedValue >= normalizedMin)
      ? parsedValue
      : fallbackDate;

  const [view, setView] = useState(
    new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
  const [day, setDay] = useState(initial.getDate());
  const year = view.getFullYear();
  const month = view.getMonth() + 1;

  const isDisabledDay = (cellDay: number) => {
    if (!normalizedMin) return false;
    const target = new Date(year, month - 1, cellDay);
    return target < normalizedMin;
  };

  const changeMonth = (offset: number) => {
    const nextView = new Date(year, month - 1 + offset, 1);
    setView(nextView);

    if (
      normalizedMin &&
      nextView.getFullYear() === normalizedMin.getFullYear() &&
      nextView.getMonth() === normalizedMin.getMonth()
    ) {
      setDay(normalizedMin.getDate());
    } else {
      setDay(1);
    }
  };

  const isCurrentSelectionDisabled = isDisabledDay(day);

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <div className="bg-surface-white flex w-full flex-col gap-4 rounded-xl px-5 py-2">
        <div className="flex h-[27px] w-full items-center justify-between">
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => changeMonth(-1)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center"
          >
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 1L1 6L5.5 11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <h2 className={`text-text-primary ${textStyles['heading-h2']}`}>
            {year}년 {month}월
          </h2>

          <button
            type="button"
            aria-label="다음 달"
            onClick={() => changeMonth(1)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center"
          >
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 1L6 6L1.5 11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7">
          {'일월화수목금토'.split('').map((weekday) => (
            <span
              key={weekday}
              className={`text-text-placeholder flex h-6 items-center justify-center ${textStyles['body-small-med']}`}
            >
              {weekday}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {monthCells(year, month).map((cell, index) => {
            if (cell === null) {
              return <span key={`empty-${index}`} className="h-10" />;
            }
            const disabled = isDisabledDay(cell);
            const isSelected = cell === day && !disabled;
            return (
              <div key={cell} className="flex h-10 items-center justify-center">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setDay(cell)}
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-colors ${
                    isSelected
                      ? 'bg-primary text-text-on-primary cursor-pointer'
                      : disabled
                        ? 'text-text-primary/25 cursor-not-allowed'
                        : 'text-text-primary cursor-pointer'
                  } ${textStyles['body-medium']}`}
                >
                  {cell}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[10px]">
        <button
          type="button"
          onClick={onCancel}
          className={`border-border-default bg-surface-white text-text-primary flex h-[52px] cursor-pointer items-center justify-center rounded-lg border px-5 ${textStyles['button-label']}`}
        >
          취소
        </button>
        <button
          type="button"
          disabled={isCurrentSelectionDisabled}
          onClick={() => {
            if (isCurrentSelectionDisabled) return;
            onSelect(formatKoreanDate(new Date(year, month - 1, day)));
          }}
          className={`flex h-[52px] items-center justify-center rounded-lg px-5 transition-colors ${
            isCurrentSelectionDisabled
              ? 'bg-border-input text-text-hint cursor-not-allowed'
              : 'bg-primary text-text-on-primary cursor-pointer'
          } ${textStyles['button-label']}`}
        >
          선택
        </button>
      </div>
    </div>
  );
}
