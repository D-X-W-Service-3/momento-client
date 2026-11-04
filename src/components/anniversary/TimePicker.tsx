import { useState } from 'react';

import WheelPicker from '@/components/common/WheelPicker';

type Props = {
  value: string;
  onCancel: () => void;
  onSelect: (value: string) => void;
};

function parseTime(value: string) {
  const match = /^(오전|오후)\s+(\d{1,2}):(\d{2})$/.exec(value);
  return {
    period: match?.[1] === '오후' ? 1 : 0,
    hour: Math.max(1, Math.min(12, Number(match?.[2] ?? 9))),
    minute: Math.max(0, Math.min(59, Number(match?.[3] ?? 0))),
  };
}

export default function TimePicker({ value, onCancel, onSelect }: Props) {
  const [time, setTime] = useState(() => parseTime(value));
  return (
    <div className="time-picker">
      <div className="time-picker-columns">
        <WheelPicker
          label="오전/오후"
          options={['오전', '오후']}
          selected={time.period}
          onSelect={(period) => setTime((current) => ({ ...current, period }))}
        />
        <WheelPicker
          label="시간"
          options={Array.from({ length: 12 }, (_, index) =>
            String(index + 1).padStart(2, '0'),
          )}
          selected={time.hour - 1}
          onSelect={(hour) =>
            setTime((current) => ({ ...current, hour: hour + 1 }))
          }
        />
        <WheelPicker
          label="분"
          options={Array.from({ length: 60 }, (_, index) =>
            String(index).padStart(2, '0'),
          )}
          selected={time.minute}
          onSelect={(minute) => setTime((current) => ({ ...current, minute }))}
        />
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
              `${time.period ? '오후' : '오전'} ${time.hour}:${String(time.minute).padStart(2, '0')}`,
            )
          }
        >
          선택
        </button>
      </div>
    </div>
  );
}
