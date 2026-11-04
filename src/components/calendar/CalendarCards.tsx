import { Link } from 'react-router-dom';
import ArchiveCard from '@/components/archive/ArchiveCard';
import Chip from '@/components/common/Chip';
import { capsuleCoverPath } from '@/constants/routes';
import type { CalendarItem } from '@/types/momento';

export default function CalendarCard({ item }: { item: CalendarItem }) {
  if (item.type === 'archive') {
    return (
      <ArchiveCard
        archive={{
          id: item.id,
          title: item.title,
          date: item.date,
          year: Number(item.date.slice(0, 4)),
          author: item.author ?? '',
          content: '',
          images: item.image ? [item.image] : [],
          imageCount: item.imageCount,
        }}
      />
    );
  }
  const dDay = item.dDay && (
    <span
      className={`d-day ${item.dDay === 'D-DAY' ? 'today' : item.dDay.startsWith('D+') ? 'past' : ''}`}
    >
      {item.dDay}
    </span>
  );
  if (item.type === 'anniversary')
    return (
      <Link
        to={`/anniversaries/${item.id}/edit`}
        className="calendar-card anniversary-calendar-card"
      >
        <div className="anniversary-card-title">
          <strong>{item.title}</strong>
          {dDay}
        </div>
        <div className="calendar-card-meta">
          <span>{item.date}</span>
        </div>
      </Link>
    );
  return (
    <Link
      to={capsuleCoverPath(String(item.id))}
      className="calendar-card capsule-calendar-card"
    >
      <div className="calendar-card-copy">
        {item.badge && <Chip tone={item.badge.tone}>{item.badge.label}</Chip>}
        <div className="calendar-card-text">
          <strong>{item.title}</strong>
          <span>{item.date} 개봉</span>
        </div>
      </div>
      <div className="calendar-card-summary">
        {dDay}
        <span>{item.meta}</span>
      </div>
    </Link>
  );
}
