import { useState, type UIEvent } from 'react';

interface ArchiveCoverCarouselProps {
  images: string[];
  /** 사진을 누르면 해당 index 로 확대 뷰어를 연다 */
  onOpen: (index: number) => void;
}

/** 아카이브 상세 상단 대표 사진. 좌우 스와이프로 넘기고, 누르면 확대 뷰어. */
export default function ArchiveCoverCarousel({
  images,
  onOpen,
}: ArchiveCoverCarouselProps) {
  const [current, setCurrent] = useState(0);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    if (track.clientWidth === 0) return;
    setCurrent(Math.round(track.scrollLeft / track.clientWidth));
  };

  if (images.length === 0) return <div className="detail-cover-wrap" />;

  return (
    <div className="detail-cover-wrap">
      <div className="detail-cover-track" onScroll={handleScroll}>
        {images.map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className="detail-cover-trigger"
            aria-label={`${index + 1}번째 사진 확대`}
            onClick={() => onOpen(index)}
          >
            <img
              className="detail-cover"
              src={image}
              alt=""
              draggable={false}
            />
          </button>
        ))}
      </div>
      <span className="detail-cover-counter">
        {Math.min(current, images.length - 1) + 1} / {images.length}
      </span>
    </div>
  );
}
