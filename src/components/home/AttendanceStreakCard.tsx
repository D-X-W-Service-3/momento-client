import CheckCircleOutlineIcon from '@/assets/icons/check-circle-outline.svg?react';
import CheckCircleSolidIcon from '@/assets/icons/check-circle-solid.svg?react';
import homeStreakMomo from '@/assets/images/home-streak-momo.png';
import { textStyles } from '@/styles/tokens';
import type { AttendanceDay } from '@/types/home';

interface AttendanceStreakCardProps {
  days: AttendanceDay[];
  streakCount: number;
}

export default function AttendanceStreakCard({
  days,
  streakCount,
}: AttendanceStreakCardProps) {
  return (
    <section className="bg-surface-white flex w-full flex-col gap-3 rounded-xl p-5">
      <h2 className={`text-text-primary ${textStyles['header-title']}`}>
        매일 모멘토에 들러보세요
      </h2>

      <div className="flex w-full items-center justify-between">
        {days.map((item) => (
          <div
            key={item.day}
            className="flex w-[25px] flex-col items-center gap-1"
          >
            {item.checked ? (
              <CheckCircleSolidIcon className="h-6 w-[25px]" />
            ) : (
              <CheckCircleOutlineIcon className="h-6 w-[25px]" />
            )}
            <span
              className={`text-center ${textStyles['body-medium']} ${
                item.checked ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              {item.day}
            </span>
          </div>
        ))}
      </div>

      <div className="flex h-[50px] w-full items-center justify-between gap-3">
        <div className="bg-streak-pill flex h-9 w-[238px] items-center justify-center rounded-full px-5 py-[10px]">
          <span
            className={`text-primary text-center ${textStyles['body-small-med']}`}
          >
            {streakCount}일 연속 접속중!
          </span>
        </div>

        <img
          src={homeStreakMomo}
          alt="하트를 안고 있는 모모"
          className="h-[50px] w-[47px] shrink-0 object-contain"
        />
      </div>
    </section>
  );
}
