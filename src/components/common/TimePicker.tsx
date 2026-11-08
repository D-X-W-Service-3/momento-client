import { useState } from 'react';

import WheelPicker from '@/components/common/WheelPicker';
import { formatKoreanTime, parseKoreanTime } from '@/utils/dates';

type Props = {
  /** '오후 3:15' 형식 */
  value: string;
  onCancel: () => void;
  onSelect: (value: string) => void;
  /** 고를 수 없는 시간이면 안내 문구를 돌려준다. 문구가 있으면 선택 버튼을 막는다. */
  validate?: (value: string) => string | undefined;
  /** 가운데 선택 줄을 회색으로 강조한다 (기본은 브랜드 틴트) */
  neutral?: boolean;
};

function toWheel(value: string) {
  const parsed = parseKoreanTime(value) ?? { hours: 9, minutes: 0 };
  return {
    period: parsed.hours >= 12 ? 1 : 0,
    hour: parsed.hours % 12 || 12,
    minute: parsed.minutes,
  };
}

export default function TimePicker({
  value,
  onCancel,
  onSelect,
  validate,
  neutral = false,
}: Props) {
  const [time, setTime] = useState(() => toWheel(value));
  const selected = formatKoreanTime(
    (time.hour % 12) + (time.period ? 12 : 0),
    time.minute,
  );
  const error = validate?.(selected);

  return (
    <div className={`time-picker${neutral ? ' neutral' : ''}`}>
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
      {error && (
        <p role="alert" className="time-picker-error">
          {error}
        </p>
      )}
      <div className="sheet-control">
        <button type="button" className="button-secondary" onClick={onCancel}>
          취소
        </button>
        <button
          type="button"
          className="button-primary"
          disabled={Boolean(error)}
          onClick={() => onSelect(selected)}
        >
          선택
        </button>
      </div>
    </div>
  );
}
