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
