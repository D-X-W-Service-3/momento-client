import { Link } from 'react-router-dom';

import type { Archive } from '@/types/momento';

export default function ArchiveCard({ archive }: { archive: Archive }) {
  return (
    <Link className="archive-card" to={`/archives/${archive.id}`}>
      {archive.images[0] && (
        <img src={archive.images[0]} alt="" loading="lazy" decoding="async" />
      )}
      <div className="archive-card-copy">
        <span>{archive.date}</span>
        <strong>
          {archive.title.split('\n').map((line) => (
            <span key={line}>{line}</span>
          ))}
        </strong>
        <small>사진 {archive.imageCount ?? archive.images.length}</small>
      </div>
      <small className="archive-author">{archive.author}</small>
    </Link>
  );
}
