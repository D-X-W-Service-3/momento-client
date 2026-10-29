import { useState } from 'react';

type Props = {
  value: string;
  onCancel: () => void;
  onSelect: (value: string) => void;
};

function parseTime(value: string) {
  const match = /^(오전|오후)\s+(\d{1,2}):(\d{2})$/.exec(value);
  return {
    period: match?.[1] === '오후' ? 1 : 0,
    hour: Number(match?.[2] ?? 9),
    minute: Number(match?.[3] ?? 0),
  };
}

export default function TimePicker({ value, onCancel, onSelect }: Props) {
  const [time, setTime] = useState(() => parseTime(value));
  const change = (key: 'period' | 'hour' | 'minute', step: number) => {
    setTime((current) => ({
      ...current,
      [key]:
        key === 'period'
          ? (current.period + 1) % 2
          : key === 'hour'
            ? ((current.hour - 1 + step + 12) % 12) + 1
            : (current.minute + step + 60) % 60,
    }));
  };
  const hour = (offset: number) =>
    String(((time.hour - 1 + offset + 12) % 12) + 1).padStart(2, '0');
  const minute = (offset: number) =>
    String((time.minute + offset + 60) % 60).padStart(2, '0');

  return (
    <div className="time-picker">
      <div className="time-picker-columns">
        <div>
          <button type="button" onClick={() => change('period', 1)}>
            {time.period ? '오전' : '오후'}
          </button>
          <strong>{time.period ? '오후' : '오전'}</strong>
          <button type="button" onClick={() => change('period', 1)}>
            {time.period ? '오전' : '오후'}
          </button>
        </div>
        <div>
          <button
            type="button"
            aria-label="시간 줄이기"
            onClick={() => change('hour', -1)}
          >
            {hour(-1)}
          </button>
          <strong>{hour(0)}</strong>
          <button
            type="button"
            aria-label="시간 늘리기"
            onClick={() => change('hour', 1)}
          >
            {hour(1)}
          </button>
        </div>
        <div>
          <button
            type="button"
            aria-label="분 줄이기"
            onClick={() => change('minute', -1)}
          >
            {minute(-1)}
          </button>
          <strong>{minute(0)}</strong>
          <button
            type="button"
            aria-label="분 늘리기"
            onClick={() => change('minute', 1)}
          >
            {minute(1)}
          </button>
        </div>
      </div>
      <div className="sheet-control">
        <button type="button" className="button-secondary" onClick={onCancel}>
          취소
        </button>
        <button
          type="button"
          className="button-primary"
          onClick={() =>
            onSelect(
              `${time.period ? '오후' : '오전'} ${time.hour}:${minute(0)}`,
            )
          }
        >
          선택
        </button>
      </div>
    </div>
  );
}
