import type { ArchiveSummary } from '@/types/calendar';
import { formatKoreanDate } from '@/utils/date';

interface ArchiveCardProps {
  archive: ArchiveSummary;
}

export default function ArchiveCard({ archive }: ArchiveCardProps) {
  return (
    <article className="flex w-full items-stretch gap-list rounded-xl bg-surface p-list shadow-card">
      <img
        src={archive.thumbnailUrl}
        alt=""
        className="size-[84px] shrink-0 rounded-xl object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-meta text-ink-muted">
            {formatKoreanDate(archive.date)}
          </p>
          <h3 className="line-clamp-2 text-button font-semibold whitespace-pre-line text-black">
            {archive.title}
          </h3>
        </div>
        <p className="text-meta text-ink-muted">사진 {archive.photoCount}</p>
      </div>
      <p className="self-end text-meta whitespace-nowrap text-ink-faint">
        {archive.authorName}
      </p>
    </article>
  );
}
