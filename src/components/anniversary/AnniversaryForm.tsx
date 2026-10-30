import { useState } from 'react';

import BottomSheet from '@/components/common/BottomSheet';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DatePicker from '@/components/common/DatePicker';
import TimePicker from '@/components/anniversary/TimePicker';
import type { AnniversaryForm as AnniversaryFormType } from '@/types/momento';

type AnniversaryFormProps = {
  initialValue?: AnniversaryFormType;
  mode: 'create' | 'edit';
  onSubmit: (value: AnniversaryFormType) => void;
  onDelete?: () => void;
};

const emptyValue: AnniversaryFormType = {
  name: '',
  date: '',
  yearly: true,
  memo: '',
  notification: true,
  notificationTime: '오전 9:00',
  reminder: '1일 전',
};

export default function AnniversaryForm({
  initialValue = emptyValue,
  mode,
  onSubmit,
  onDelete,
}: AnniversaryFormProps) {
  const [value, setValue] = useState(initialValue);
  const [sheet, setSheet] = useState<'date' | 'time' | 'reminder' | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const update = <K extends keyof AnniversaryFormType>(
    key: K,
    next: AnniversaryFormType[K],
  ) => setValue((current) => ({ ...current, [key]: next }));
  return (
    <>
      <form
        className="anniversary-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (value.name.trim() && value.date)
            onSubmit({ ...value, name: value.name.trim() });
          else setShowErrors(true);
        }}
      >
        {mode === 'create' && (
          <div className="form-intro">
            <h1>특별한 날을 기록하고 알림을 받아보세요</h1>
            <p>매년 돌아오는 특별한 날을 모멘토에서 기억해드릴게요</p>
          </div>
        )}
        <section className="form-card">
          <label className="input-group">
            <span>기념일 이름</span>
            <div>
              <input
                required
                value={value.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="예) 우리 100일, 엄마 생신"
              />
            </div>
            <small>기념일 이름을 선택해주세요</small>
            {showErrors && !value.name.trim() && (
              <small className="field-error">
                기념일 이름을 입력해 주세요.
              </small>
            )}
          </label>
        </section>
        <section className="form-card anniversary-date-card">
          <label className="input-group">
            <span>기념일 날짜</span>
            <button
              type="button"
              className="input-button"
              onClick={() => setSheet('date')}
            >
              {value.date || '날짜를 선택해주세요'}
              <img src="/assets/anniversary/date.svg" alt="" />
            </button>
            {showErrors && !value.date && (
              <small className="field-error">
                기념일 날짜를 선택해 주세요.
              </small>
            )}
          </label>
          <div className="toggle-row">
            <span>
              <strong>매년 반복</strong>
              <small>매년 같은 날이 기념일로 지정돼요</small>
            </span>
            <button
              type="button"
              className={value.yearly ? 'toggle on' : 'toggle'}
              onClick={() => update('yearly', !value.yearly)}
            >
              <span />
            </button>
          </div>
        </section>
        <section className="form-card">
          <label className="input-group">
            <span>메모 (선택)</span>
            <div className="textarea-wrap">
              <textarea
                maxLength={200}
                value={value.memo}
                onChange={(event) => update('memo', event.target.value)}
                placeholder="이 기념일에 대해 메모를 남겨보세요"
              />
            </div>
            <small>{value.memo.length} / 200</small>
          </label>
        </section>
        <section className="form-card notification-card">
          <h2>알림 설정</h2>
          <div className="notification-rows">
            <div className="notification-row">
              <span className="row-icon">
                <img src="/assets/anniversary/bell.svg" alt="" />
              </span>
              <span>
                <strong>알림 받기</strong>
                <small>기념일 당일에 알림을 받아요</small>
              </span>
              <button
                type="button"
                className={value.notification ? 'toggle on' : 'toggle'}
                onClick={() => update('notification', !value.notification)}
              >
                <span />
              </button>
            </div>
            <button
              type="button"
              className="notification-row"
              onClick={() => setSheet('time')}
            >
              <span className="row-icon">
                <img src="/assets/anniversary/clock.svg" alt="" />
              </span>
              <strong>알림 받기</strong>
              <small className="row-value">
                {value.notificationTime}
                <img src="/assets/anniversary/chevron.svg" alt="" />
              </small>
            </button>
            <button
              type="button"
              className="notification-row"
              onClick={() => setSheet('reminder')}
            >
              <span className="row-icon">
                <img src="/assets/anniversary/reminder.svg" alt="" />
              </span>
              <strong>미리 알림</strong>
              <small className="row-value">
                {value.reminder}
                <img src="/assets/anniversary/chevron.svg" alt="" />
              </small>
            </button>
          </div>
        </section>
        {mode === 'create' ? (
          <button type="submit" className="button-primary anniversary-submit">
            저장하기
          </button>
        ) : (
          <div className="form-controls">
            <button
              type="button"
              className="button-secondary"
              onClick={() => setDeleteOpen(true)}
            >
              삭제
            </button>
            <button type="submit" className="button-primary">
              수정하기
            </button>
          </div>
        )}
      </form>
      <BottomSheet open={sheet === 'date'} onClose={() => setSheet(null)}>
        <DatePicker
          value={value.date}
          onCancel={() => setSheet(null)}
          onSelect={(date) => {
            update('date', date);
            setSheet(null);
          }}
        />
      </BottomSheet>
      <BottomSheet
        open={sheet === 'time'}
        onClose={() => setSheet(null)}
        title="언제 알림을 받을까요"
      >
        <TimePicker
          value={value.notificationTime}
          onCancel={() => setSheet(null)}
          onSelect={(selected) => {
            update('notificationTime', selected);
            setSheet(null);
          }}
        />
      </BottomSheet>
      <BottomSheet
        open={sheet === 'reminder'}
        onClose={() => setSheet(null)}
        title="언제 미리 알림을 받을까요"
      >
        <div className="option-list">
          {['1일 전', '3일 전', '5일 전', '7일 전', '10일 전'].map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => {
                update('reminder', option);
                setSheet(null);
              }}
            >
              {option}
              <span>{value.reminder === option ? '✓' : ''}</span>
            </button>
          ))}
        </div>
      </BottomSheet>
      <ConfirmDialog
        open={deleteOpen}
        title="기념일을 삭제할까요?"
        description="이 기념일에 대한 알림을 더 이상 받을 수 없어요"
        confirmLabel="삭제"
        danger
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => onDelete?.()}
      />
    </>
  );
}
