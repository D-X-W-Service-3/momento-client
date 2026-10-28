import CapsuleCalendarIcon from '@/assets/icons/capsule-calendar.svg?react';
import CapsuleEditIcon from '@/assets/icons/capsule-edit.svg?react';
import CapsuleInfoIcon from '@/assets/icons/capsule-info.svg?react';
import CapsuleLockClosedIcon from '@/assets/icons/capsule-lock-closed.svg?react';
import CapsuleLockOpenIcon from '@/assets/icons/capsule-lock-open.svg?react';
import CapsuleStepArrowIcon from '@/assets/icons/capsule-step-arrow.svg?react';
import { textStyles } from '@/styles/tokens';

interface CapsuleDateStepProps {
  editDeadline: string;
  openDate: string;
  onOpenDatePicker: (target: 'editDeadline' | 'openDate') => void;
}

export default function CapsuleDateStep({
  editDeadline,
  openDate,
  onOpenDatePicker,
}: CapsuleDateStepProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className={`text-black ${textStyles['heading-h2']}`}>
          언제 추억을 열어볼까요?
        </h2>
        <p className={`text-text-secondary ${textStyles['body-xs']}`}>
          캡슐이 잠기고 다시 열리는 날짜를 정해주세요
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-2">
        <section className="bg-surface-white flex w-full flex-col gap-3 rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary-tint flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <CapsuleEditIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <strong
                className={`text-text-primary ${textStyles['body-large-semi']}`}
              >
                편지 수정 마감일
              </strong>
              <span className={`text-text-secondary ${textStyles['body-xs']}`}>
                편지를 작성할 수 있는 마지막 날
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenDatePicker('editDeadline')}
            className="border-border-default bg-surface-white flex h-[52px] w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-4"
          >
            <span
              className={`${
                editDeadline ? 'text-text-primary' : 'text-text-placeholder'
              } ${textStyles['body-medium']}`}
            >
              {editDeadline || '날짜를 선택해주세요'}
            </span>
            <CapsuleCalendarIcon className="h-[18px] w-[18px] shrink-0" />
          </button>
        </section>

        <CapsuleStepArrowIcon className="h-6 w-6 shrink-0" />

        <section className="bg-surface-white flex w-full items-center gap-3 rounded-lg p-5">
          <div className="bg-primary-tint flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
            <CapsuleLockClosedIcon className="h-6 w-[19px]" />
          </div>
          <div className="flex flex-col gap-1">
            <strong
              className={`text-text-primary ${textStyles['body-large-semi']}`}
            >
              캡슐 잠금
            </strong>
            <span className={`text-text-secondary ${textStyles['body-xs']}`}>
              편지 수정 마감일 부터 개봉일까지
              <br />
              캡슐을 열어볼 수 없어요
            </span>
          </div>
        </section>

        <CapsuleStepArrowIcon className="h-6 w-6 shrink-0" />

        <section className="bg-surface-white flex w-full flex-col gap-3 rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary-tint flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <CapsuleLockOpenIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <strong
                className={`text-text-primary ${textStyles['body-large-semi']}`}
              >
                개봉일
              </strong>
              <span className={`text-text-secondary ${textStyles['body-xs']}`}>
                추억을 다시 열어볼 날
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenDatePicker('openDate')}
            className="border-border-default bg-surface-white flex h-[52px] w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-4"
          >
            <span
              className={`${
                openDate ? 'text-text-primary' : 'text-text-placeholder'
              } ${textStyles['body-medium']}`}
            >
              {openDate || '날짜를 선택해주세요'}
            </span>
            <CapsuleCalendarIcon className="h-[18px] w-[18px] shrink-0" />
          </button>
        </section>
      </div>

      <div className="flex items-center gap-2">
        <CapsuleInfoIcon className="h-5 w-5 shrink-0" />
        <span className={`text-text-secondary ${textStyles['body-xs']}`}>
          캡슐이 잠겨있는 동안에는 수정 및 삭제가 불가능해요
        </span>
      </div>
    </div>
  );
}
