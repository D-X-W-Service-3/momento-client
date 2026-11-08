import { useEffect, useRef } from 'react';

type Props = {
  images: string[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
  onDelete?: (index: number) => void;
  onMakeCover?: (index: number) => void;
  onMore?: () => void;
};

export default function ArchiveImageViewer({
  images,
  index,
  onChange,
  onClose,
  onDelete,
  onMakeCover,
  onMore,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  // 화살표·키보드로 index 가 바뀌면 해당 슬라이드로 스크롤한다.
  // 처음 열릴 때는 애니메이션 없이 바로 이동, 스와이프로 이미 도착했으면 생략.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const left = index * track.clientWidth;
    if (Math.abs(track.scrollLeft - left) > 1) {
      track.scrollTo({
        left,
        behavior: hasMountedRef.current ? 'smooth' : 'instant',
      });
    }
    hasMountedRef.current = true;
  }, [index]);

  // 스와이프 위치에 맞춰 현재 index 를 동기화
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    if (next !== index && next >= 0 && next < images.length) onChange(next);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        onChange(index - 1);
      }
      if (event.key === 'ArrowRight' && index < images.length - 1) {
        event.preventDefault();
        onChange(index + 1);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [images.length, index, onChange, onClose]);

  return (
    <div
      className="image-viewer"
      role="dialog"
      aria-modal="true"
      aria-label="아카이브 사진 확대"
    >
      <div
        ref={trackRef}
        className="image-viewer-track"
        onScroll={handleScroll}
      >
        {images.map((image, imageIndex) => (
          <div className="image-viewer-slide" key={`${image}-${imageIndex}`}>
            <img
              className="image-viewer-photo"
              src={image}
              alt={`${imageIndex + 1}번째 아카이브 사진`}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="image-viewer-close"
        aria-label="사진 닫기"
        onClick={onClose}
      >
        <img src="/assets/archive/detail-back.svg" alt="" />
      </button>
      <span className="image-viewer-counter">
        {index + 1}/{images.length}
      </span>
      {onMore && (
        <button
          type="button"
          className="image-viewer-more"
          aria-label="더보기"
          onClick={onMore}
        >
          <img src="/assets/archive/detail-more.svg" alt="" />
        </button>
      )}
      {index > 0 && (
        <button
          type="button"
          className="image-viewer-arrow previous"
          aria-label="이전 사진"
          onClick={() => onChange(index - 1)}
        >
          <img src="/assets/archive/detail-back.svg" alt="" />
        </button>
      )}
      {index < images.length - 1 && (
        <button
          type="button"
          className="image-viewer-arrow next"
          aria-label="다음 사진"
          onClick={() => onChange(index + 1)}
        >
          <img src="/assets/archive/detail-back.svg" alt="" />
        </button>
      )}
      {onDelete && (
        <div className="image-viewer-actions">
          <button type="button" onClick={() => onDelete(index)}>
            <img src="/assets/archive/viewer-delete.svg" alt="" />
            <span>이미지 삭제</span>
          </button>
          {index !== 0 && onMakeCover && (
            <button type="button" onClick={() => onMakeCover(index)}>
              <img src="/assets/archive/viewer-cover.svg" alt="" />
              <span>대표사진 변경</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
