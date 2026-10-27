import type { CalendarItem } from '@/types/momento';
import { Link } from 'react-router-dom';

const statusLabels = {
  open: '개봉 가능',
  sealed: '봉인됨',
  writing: '작성 중',
};

export default function CalendarCard({ item }: { item: CalendarItem }) {
  if (item.type === 'archive') {
    return (
      <Link
        to={`/archives/${item.id}`}
        className="calendar-card archive-calendar-card"
      >
        {item.image && <img src={item.image} alt="" />}
        <div>
          <small>{item.date}</small>
          <strong>
            {item.title.split('\n').map((line) => (
              <span key={line}>{line}</span>
            ))}
          </strong>
          <small>{item.meta}</small>
        </div>
      </Link>
    );
  }
  const contents = (
    <>
      <div className="calendar-card-head">
        {item.status && (
          <span className={`status ${item.status}`}>
            {statusLabels[item.status]}
          </span>
        )}
        {item.dDay && <span className="d-day">{item.dDay}</span>}
      </div>
      <strong>{item.title}</strong>
      <div className="calendar-card-meta">
        <span>{item.date}</span>
        <span>{item.meta}</span>
      </div>
    </>
  );
  if (item.type === 'anniversary')
    return (
      <Link
        to={`/anniversaries/${item.id}/edit`}
        className="calendar-card anniversary-calendar-card"
      >
        <div className="anniversary-card-title">
          <strong>{item.title}</strong>
          {item.dDay && <span className="d-day">{item.dDay}</span>}
        </div>
        <div className="calendar-card-meta">
          <span>{item.date}</span>
          <span>{item.meta}</span>
        </div>
      </Link>
    );
  return <article className="calendar-card">{contents}</article>;
}
