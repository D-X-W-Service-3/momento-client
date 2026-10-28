import { useState } from 'react';

import { textStyles } from '@/styles/tokens';
import { formatKoreanDate, monthCells, parseKoreanDate } from '@/utils/dates';

interface DatePickerProps {
  value?: string;
  onCancel: () => void;
  onSelect: (value: string) => void;
  minDate?: Date;
}

type PickerMode = 'day' | 'year' | 'month';

const YEAR_GRID_COUNT = 12;

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
  const [mode, setMode] = useState<PickerMode>('day');
  const [yearPageStart, setYearPageStart] = useState(() =>
    normalizedMin ? normalizedMin.getFullYear() : initial.getFullYear() - 4,
  );

  const year = view.getFullYear();
  const month = view.getMonth() + 1;

  const syncDayForMonth = (targetYear: number, targetMonthIndex: number) => {
    const daysInTargetMonth = new Date(
      targetYear,
      targetMonthIndex + 1,
      0,
    ).getDate();
    let nextDay = Math.min(day, daysInTargetMonth);

    if (
      normalizedMin &&
      targetYear === normalizedMin.getFullYear() &&
      targetMonthIndex === normalizedMin.getMonth() &&
      nextDay < normalizedMin.getDate()
    ) {
      nextDay = normalizedMin.getDate();
    }

    setDay(nextDay);
  };

  const isDisabledDay = (cellDay: number) => {
    if (!normalizedMin) return false;
    const target = new Date(year, month - 1, cellDay);
    return target < normalizedMin;
  };

  const isDisabledYear = (targetYear: number) => {
    if (!normalizedMin) return false;
    return targetYear < normalizedMin.getFullYear();
  };

  const isDisabledMonth = (targetYear: number, targetMonth: number) => {
    if (!normalizedMin) return false;
    if (targetYear < normalizedMin.getFullYear()) return true;
    if (
      targetYear === normalizedMin.getFullYear() &&
      targetMonth < normalizedMin.getMonth() + 1
    ) {
      return true;
    }
    return false;
  };

  const handleHeaderNav = (offset: number) => {
    if (mode === 'year') {
      setYearPageStart((prev) => prev + offset * YEAR_GRID_COUNT);
      return;
    }

    if (mode === 'month') {
      const nextYear = year + offset;
      let nextMonthIndex = month - 1;
      if (
        normalizedMin &&
        nextYear === normalizedMin.getFullYear() &&
        nextMonthIndex < normalizedMin.getMonth()
      ) {
        nextMonthIndex = normalizedMin.getMonth();
      }
      setView(new Date(nextYear, nextMonthIndex, 1));
      syncDayForMonth(nextYear, nextMonthIndex);
      return;
    }

    const nextView = new Date(year, month - 1 + offset, 1);
    setView(nextView);
    syncDayForMonth(nextView.getFullYear(), nextView.getMonth());
  };

  const handleOpenYearPicker = () => {
    const start = normalizedMin
      ? Math.max(
          normalizedMin.getFullYear(),
          year - ((year - normalizedMin.getFullYear()) % YEAR_GRID_COUNT),
        )
      : year - 4;
    setYearPageStart(start);
    setMode((prev) => (prev === 'year' ? 'day' : 'year'));
  };

  const handleOpenMonthPicker = () => {
    setMode((prev) => (prev === 'month' ? 'day' : 'month'));
  };

  const handleSelectYear = (selectedYear: number) => {
    if (isDisabledYear(selectedYear)) return;
    let nextMonthIndex = month - 1;
    if (
      normalizedMin &&
      selectedYear === normalizedMin.getFullYear() &&
      nextMonthIndex < normalizedMin.getMonth()
    ) {
      nextMonthIndex = normalizedMin.getMonth();
    }
    setView(new Date(selectedYear, nextMonthIndex, 1));
    syncDayForMonth(selectedYear, nextMonthIndex);
    setMode('month');
  };

  const handleSelectMonth = (selectedMonth: number) => {
    if (isDisabledMonth(year, selectedMonth)) return;
    const nextMonthIndex = selectedMonth - 1;
    setView(new Date(year, nextMonthIndex, 1));
    syncDayForMonth(year, nextMonthIndex);
    setMode('day');
  };

  const isCurrentSelectionDisabled = isDisabledDay(day);
  const yearOptions = Array.from(
    { length: YEAR_GRID_COUNT },
    (_, index) => yearPageStart + index,
  );
  const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <div className="bg-surface-white flex w-full flex-col gap-4 rounded-xl px-5 py-2">
        <div className="flex h-[27px] w-full items-center justify-between">
          <button
            type="button"
            aria-label="이전"
            onClick={() => handleHeaderNav(-1)}
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

          <h2
            className={`text-text-primary flex items-center gap-1 ${textStyles['heading-h2']}`}
          >
            <button
              type="button"
              onClick={handleOpenYearPicker}
              className="cursor-pointer p-0"
            >
              {year}년
            </button>
            <button
              type="button"
              onClick={handleOpenMonthPicker}
              className="cursor-pointer p-0"
            >
              {month}월
            </button>
          </h2>

          <button
            type="button"
            aria-label="다음"
            onClick={() => handleHeaderNav(1)}
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

        {mode === 'year' && (
          <div className="grid min-h-[256px] grid-cols-4 grid-rows-3 gap-2 py-2">
            {yearOptions.map((optionYear) => {
              const disabled = isDisabledYear(optionYear);
              const isSelected = optionYear === year && !disabled;
              return (
                <button
                  key={optionYear}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectYear(optionYear)}
                  className={`flex items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-primary text-text-on-primary cursor-pointer'
                      : disabled
                        ? 'text-text-primary/25 cursor-not-allowed'
                        : 'bg-surface-gray text-text-primary cursor-pointer'
                  } ${textStyles['body-medium']}`}
                >
                  {optionYear}년
                </button>
              );
            })}
          </div>
        )}

        {mode === 'month' && (
          <div className="grid min-h-[256px] grid-cols-4 grid-rows-3 gap-2 py-2">
            {monthOptions.map((optionMonth) => {
              const disabled = isDisabledMonth(year, optionMonth);
              const isSelected = optionMonth === month && !disabled;
              return (
                <button
                  key={optionMonth}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectMonth(optionMonth)}
                  className={`flex items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-primary text-text-on-primary cursor-pointer'
                      : disabled
                        ? 'text-text-primary/25 cursor-not-allowed'
                        : 'bg-surface-gray text-text-primary cursor-pointer'
                  } ${textStyles['body-medium']}`}
                >
                  {optionMonth}월
                </button>
              );
            })}
          </div>
        )}

        {mode === 'day' && (
          <>
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
                  <div
                    key={cell}
                    className="flex h-10 items-center justify-center"
                  >
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
          </>
        )}
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
