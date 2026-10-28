import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import BottomSheet from '@/components/common/BottomSheet';
import { PlusIcon, SearchIcon } from '@/components/common/Icons';
import CalendarCard from '@/components/calendar/CalendarCards';
import MonthCalendar from '@/components/calendar/MonthCalendar';
import { BrandHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import { useCalendarItems } from '@/hooks/useCalendarItems';
import type { CalendarItem } from '@/types/momento';
import { formatKoreanDate, parseKoreanDate } from '@/utils/dates';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const calendarItems = useCalendarItems();
  const initialDate =
    parseKoreanDate(searchParams.get('date') ?? '') ?? new Date();
  const [view, setView] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [makeOpen, setMakeOpen] = useState(false);
  const year = view.getFullYear();
  const month = view.getMonth() + 1;
  const today = new Date();
  const filters = [
    `전체 ${calendarItems.length}`,
    `캡슐 ${calendarItems.filter((item) => item.type === 'capsule').length}`,
    `아카이브 ${calendarItems.filter((item) => item.type === 'archive').length}`,
    `기념일 ${calendarItems.filter((item) => item.type === 'anniversary').length}`,
  ];
  const visibleItems = calendarItems.filter(
    (item) =>
      selectedFilter === 0 ||
      item.type === ['capsule', 'archive', 'anniversary'][selectedFilter - 1],
  );
  const markersByDay: Record<number, CalendarItem['type'][]> = {};
  visibleItems.forEach((item) => {
    const date = parseKoreanDate(item.date);
    if (
      !date ||
      (!item.yearly && date.getFullYear() !== year) ||
      date.getMonth() + 1 !== month
    )
      return;
    const day = date.getDate();
    const types = markersByDay[day] ?? [];
    if (!types.includes(item.type)) markersByDay[day] = [...types, item.type];
  });

  return (
    <MobileLayout withNav>
      <BrandHeader />
      <section className="calendar-hero">
        <div>
          <h1>캘린더</h1>
          <p>
            오늘의
            <br />
            추억을 저장해보세요
          </p>
        </div>
        <img className="hero-cloud" src="/assets/archive/list-01.png" alt="" />
        <div className="hero-mascot">
          <img src="/assets/archive/list-02.png" alt="" />
        </div>
      </section>
      <section className="page-body calendar-body">
        <Link className="search-field calendar-search" to="/calendar/search">
          <span>캡슐 및 아카이브, 기념일 검색</span>
          <SearchIcon />
        </Link>
        <div className="filter-chips">
          {filters.map((filter, index) => (
            <button
              type="button"
              key={filter}
              className={selectedFilter === index ? 'active' : ''}
              onClick={() => setSelectedFilter(index)}
            >
              {filter}
            </button>
          ))}
        </div>
        <MonthCalendar
          year={year}
          month={month}
          selectedDay={selectedDay}
          markersByDay={markersByDay}
          onSelect={setSelectedDay}
          onChangeMonth={(offset) => {
            setView(new Date(year, month - 1 + offset, 1));
            setSelectedDay(1);
          }}
        />
        <section className="calendar-results">
          <h2>{formatKoreanDate(today)}</h2>
          {visibleItems.length === 0 && (
            <p className="empty-state">저장된 추억이 없어요.</p>
          )}
          {(['capsule', 'anniversary', 'archive'] as const).map((type) => {
            const typeItems = visibleItems.filter((item) => item.type === type);
            if (!typeItems.length) return null;
            return (
              <div className="calendar-group" key={type}>
                <h3 className={type}>
                  {type === 'capsule'
                    ? '타임캡슐'
                    : type === 'anniversary'
                      ? '기념일'
                      : '아카이브'}
                </h3>
                {typeItems.map((item) => (
                  <CalendarCard key={item.id} item={item} />
                ))}
              </div>
            );
          })}
        </section>
      </section>
      <button
        type="button"
        className="floating-button"
        onClick={() => setMakeOpen(true)}
        aria-label="추가"
      >
        <PlusIcon />
      </button>
      <BottomSheet open={makeOpen} onClose={() => setMakeOpen(false)}>
        <div className="create-menu">
          <button type="button" onClick={() => navigate('/capsules/new')}>
            <span>
              <strong>타임캡슐 만들기</strong>
              <small>
                미래의 나 또는 친구에게
                <br />
                편지를 남겨보세요
              </small>
            </span>
            <b>›</b>
          </button>
          <button type="button" onClick={() => navigate('/anniversaries/new')}>
            <span>
              <strong>기념일 등록하기</strong>
              <small>
                특별한 날짜를 저장하고
                <br />
                알림을 받아보세요
              </small>
            </span>
            <b>›</b>
          </button>
          <button type="button" onClick={() => navigate('/archives/new')}>
            <span>
              <strong>아카이브 작성하기</strong>
              <small>
                오늘의 추억을
                <br />
                일기처럼 남겨보세요
              </small>
            </span>
            <b>›</b>
          </button>
        </div>
      </BottomSheet>
    </MobileLayout>
  );
}
