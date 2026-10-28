import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useRef,
  useState,
} from 'react';

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

const DRAG_CLOSE_THRESHOLD = 50;

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const [rendered, setRendered] = useState(open);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef(0);
  const movedRef = useRef(false);

  if (open && !rendered) {
    setRendered(true);
    setDragY(0);
  }

  if (!open && !rendered) return null;

  const isClosing = !open && rendered;

  const handleGrabberPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isClosing) return;
    dragStartYRef.current = event.clientY;
    movedRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleGrabberPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaY = Math.max(0, event.clientY - dragStartYRef.current);
    if (deltaY > 4) {
      movedRef.current = true;
    }
    setDragY(deltaY);
  };

  const handleGrabberPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);

    if (dragY > DRAG_CLOSE_THRESHOLD || !movedRef.current) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  const sheetStyle: CSSProperties = {
    '--sheet-drag-y': `${dragY}px`,
    transform: !isClosing && dragY > 0 ? `translateY(${dragY}px)` : undefined,
    transition:
      !isClosing && !isDragging && dragY === 0
        ? 'transform 0.2s ease-out'
        : undefined,
  } as CSSProperties;

  return (
    <div
      className={`sheet-backdrop${isClosing ? ' closing' : ''}`}
      role="presentation"
      onMouseDown={() => {
        if (!isClosing) onClose();
      }}
    >
      <section
        className={`bottom-sheet${isClosing ? ' closing' : ''}`}
        role="dialog"
        aria-modal="true"
        style={sheetStyle}
        onMouseDown={(event) => event.stopPropagation()}
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (!open) {
            setRendered(false);
            setDragY(0);
          }
        }}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label="바텀시트 닫기"
          className="sheet-grabber-area"
          onPointerDown={handleGrabberPointerDown}
          onPointerMove={handleGrabberPointerMove}
          onPointerUp={handleGrabberPointerEnd}
          onPointerCancel={handleGrabberPointerEnd}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onClose();
            }
          }}
        >
          <div className="sheet-grabber" />
        </div>
        {title && <h2>{title}</h2>}
        {children}
      </section>
    </div>
  );
}
