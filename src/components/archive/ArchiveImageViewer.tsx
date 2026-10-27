import { useEffect } from 'react';

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
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && index > 0) onChange(index - 1);
      if (event.key === 'ArrowRight' && index < images.length - 1)
        onChange(index + 1);
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
      <img
        className="image-viewer-photo"
        src={images[index]}
        alt={`${index + 1}번째 아카이브 사진`}
      />
      <button
        type="button"
        className="image-viewer-close"
        aria-label="사진 닫기"
        onClick={onClose}
      >
        ‹
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
          ···
        </button>
      )}
      {index > 0 && (
        <button
          type="button"
          className="image-viewer-arrow previous"
          aria-label="이전 사진"
          onClick={() => onChange(index - 1)}
        >
          ‹
        </button>
      )}
      {index < images.length - 1 && (
        <button
          type="button"
          className="image-viewer-arrow next"
          aria-label="다음 사진"
          onClick={() => onChange(index + 1)}
        >
          ›
        </button>
      )}
      {onDelete && (
        <div className="image-viewer-actions">
          <button type="button" onClick={() => onDelete(index)}>
            <span aria-hidden="true">×</span>이미지 삭제
          </button>
          {index !== 0 && onMakeCover && (
            <button type="button" onClick={() => onMakeCover(index)}>
              <span aria-hidden="true">★</span>대표사진 변경
            </button>
          )}
        </div>
      )}
    </div>
  );
}
