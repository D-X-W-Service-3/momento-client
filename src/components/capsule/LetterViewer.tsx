import { useEffect, useState } from 'react';

import chevronLeftIcon from '@/assets/icons/chevron-left-16.svg';
import chevronRightIcon from '@/assets/icons/chevron-right-16.svg';
import closeIcon from '@/assets/icons/close.svg';
import trashIcon from '@/assets/icons/trash.svg';
import type { Letter } from '@/types/letter';
import { formatKoreanDate } from '@/utils/date';

interface LetterViewerProps {
  open: boolean;
  letters: Letter[];
  onClose: () => void;
  /** 넘기면 좌측 상단에 삭제 버튼이 생긴다 (내가 쓴 편지) */
  onDelete?: (letterId: string) => void;
}

/** 캡슐 화면 위에 떠서 편지를 한 장씩 넘겨보는 모달 */
export default function LetterViewer({
  open,
  letters,
  onClose,
  onDelete,
}: LetterViewerProps) {
  const [index, setIndex] = useState(0);

  // 다시 열었을 때는 첫 장부터 본다.
  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
      if (event.key === 'ArrowRight')
        setIndex((i) => Math.min(letters.length - 1, i + 1));
    };
    document.addEventListener('keydown', handleKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose, letters.length]);

  // 편지가 삭제되어 마지막 인덱스를 벗어나면 이전 장으로 맞춘다.
  useEffect(() => {
    if (letters.length > 0 && index >= letters.length) {
      setIndex(letters.length - 1);
    }
  }, [index, letters.length]);

  const safeIndex = Math.min(index, Math.max(0, letters.length - 1));
  const letter = letters[safeIndex];
  if (!open || !letter) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-list bg-black/50 p-5"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[353px] items-center justify-between"
        onClick={(event) => event.stopPropagation()}
      >
        {onDelete ? (
          <button
            type="button"
            aria-label="편지 삭제"
            onClick={() => onDelete(letter.id)}
          >
            <img src={trashIcon} alt="" className="size-7" />
          </button>
        ) : (
          <span aria-hidden className="size-7" />
        )}
        <button type="button" aria-label="닫기" onClick={onClose}>
          <img src={closeIcon} alt="" className="size-8" />
        </button>
      </div>

      <article
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[353px] flex-col items-center gap-list overflow-hidden rounded-xl bg-surface px-5 py-6 shadow-level-2"
      >
        {letter.imageUrl && (
          <img
            src={letter.imageUrl}
            alt=""
            className="size-[280px] shrink-0 object-cover"
          />
        )}

        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center justify-between font-display text-meta whitespace-nowrap">
            <span className="text-ink-muted">
              {formatKoreanDate(letter.date)}
            </span>
            <span className="text-ink-faint">{letter.authorName}</span>
          </div>
          <h2 className="w-full font-serif text-letter text-black">
            {letter.title}
          </h2>
        </div>

        <p className="w-full font-serif text-quote whitespace-pre-line text-ink">
          {letter.content}
        </p>
      </article>

      <div
        onClick={(event) => event.stopPropagation()}
        className="flex items-center justify-center gap-2.5 rounded-full bg-surface p-2"
      >
        <button
          type="button"
          aria-label="이전 편지"
          disabled={safeIndex === 0}
          onClick={() => setIndex(safeIndex - 1)}
          className="disabled:opacity-30"
        >
          <img src={chevronLeftIcon} alt="" className="size-4" />
        </button>
        <span className="w-[18px] text-center text-note font-semibold text-ink">
          {safeIndex + 1}/{letters.length}
        </span>
        <button
          type="button"
          aria-label="다음 편지"
          disabled={safeIndex === letters.length - 1}
          onClick={() => setIndex(safeIndex + 1)}
          className="disabled:opacity-30"
        >
          <img src={chevronRightIcon} alt="" className="size-4" />
        </button>
      </div>
    </div>
  );
}
