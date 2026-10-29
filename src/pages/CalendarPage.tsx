import { AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';

import cloudImage from '@/assets/images/cloud.png';
import mascotImage from '@/assets/images/mascot.png';
import ArchiveCard from '@/components/common/ArchiveCard';
import CapsuleCard from '@/components/common/CapsuleCard';
import CategoryTabs from '@/components/common/CategoryTabs';
import DatePicker from '@/components/common/DatePicker';
import SearchBar from '@/components/common/SearchBar';
import { ROUTES } from '@/constants/routes';
import { useCalendarCounts, useCalendarEntries } from '@/hooks/useCalendar';
import { useCalendarStore } from '@/stores/calendarStore';
import { formatKoreanDate } from '@/utils/date';

// 헤더 우측 구름 장식 (Figma 좌표를 화면 오른쪽 기준으로 환산)
const CLOUDS = [
  { className: 'right-[81px] top-[87px] size-[113px]' },
  { className: 'right-5 top-16 size-[143px]' },
  { className: 'right-0 top-[87px] size-[113px] -scale-x-100' },
  { className: 'right-[95px] top-[74px] size-[130px] -scale-x-100' },
  { className: 'right-[156px] top-[95px] size-[105px]' },
];

export default function CalendarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // 검색 등 하위 화면. 닫힐 때 애니메이션이 끝날 때까지 AnimatePresence 가 유지한다.
  const outlet = useOutlet();
  const { viewMonth, selectedDate, filter, moveMonth, selectDate, setFilter } =
    useCalendarStore();
  const { data: entries } = useCalendarEntries(viewMonth);
  const { data: counts } = useCalendarCounts();

  const dayEntry = entries?.[selectedDate];
  const capsules = filter === 'archive' ? [] : (dayEntry?.capsules ?? []);
  const archives = filter === 'capsule' ? [] : (dayEntry?.archives ?? []);

  return (
    <>
      <main className="relative mt-[9px] flex flex-col gap-card px-5">
        <div aria-hidden className="pointer-events-none">
          {CLOUDS.map((cloud, index) => (
            <img
              key={index}
              src={cloudImage}
              alt=""
              className={`absolute object-cover ${cloud.className}`}
            />
          ))}
        </div>

        <section className="relative flex flex-col">
          <div className="-mb-[30px] flex h-[200px] items-center justify-between">
            <div className="flex h-full min-w-0 flex-1 flex-col gap-stack py-10">
              <h1 className="text-title-md font-bold text-ink">캘린더</h1>
              <p className="text-caption whitespace-pre-line text-ink-muted">
                {'오늘의\n추억을 저장해보세요'}
              </p>
            </div>
            <div className="relative h-[168px] w-[155px] shrink-0 overflow-hidden">
              <img
                src={mascotImage}
                alt=""
                className="absolute top-[-17.4%] left-[-23.58%] h-[124.66%] w-[269.84%] max-w-none"
              />
            </div>
          </div>

          <div className="relative flex flex-col gap-card">
            <SearchBar
              readOnly
              placeholder="캡슐 및 아카이브 검색"
              onClick={() => navigate(ROUTES.CALENDAR_SEARCH)}
            />
            <CategoryTabs value={filter} counts={counts} onChange={setFilter} />
            <DatePicker
              month={viewMonth}
              selectedDate={selectedDate}
              entries={entries}
              onSelectDate={selectDate}
              onMoveMonth={moveMonth}
            />
          </div>
        </section>

        <section className="flex flex-col gap-list">
          <h2 className="text-button font-semibold text-ink">
            {formatKoreanDate(selectedDate)}
          </h2>

          <div className="flex flex-col gap-card">
            {capsules.length > 0 && (
              <div className="flex flex-col gap-list">
                <h3 className="text-label font-medium text-ink-muted">
                  타임캡슐
                </h3>
                {capsules.map((capsule) => (
                  <CapsuleCard key={capsule.id} capsule={capsule} />
                ))}
              </div>
            )}

            {archives.length > 0 && (
              <div className="flex flex-col gap-list">
                <h3 className="text-label font-medium text-ink-muted">
                  아카이브
                </h3>
                {archives.map((archive) => (
                  <ArchiveCard key={archive.id} archive={archive} />
                ))}
              </div>
            )}

            {capsules.length === 0 && archives.length === 0 && (
              <p className="py-section text-center text-caption text-ink-faint">
                이 날의 기록이 없어요
              </p>
            )}
          </div>
        </section>
      </main>
      <AnimatePresence>
        {outlet && <div key={location.pathname}>{outlet}</div>}
      </AnimatePresence>
    </>
  );
}
