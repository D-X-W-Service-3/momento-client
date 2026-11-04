import { type MouseEvent, useRef } from 'react';

export function useHorizontalDragScroll<
  T extends HTMLElement = HTMLDivElement,
>() {
  const containerRef = useRef<T | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const onMouseDown = (e: MouseEvent<T>) => {
    const el = containerRef.current;
    if (!el) return;
    isDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const onMouseMove = (e: MouseEvent<T>) => {
    const el = containerRef.current;
    if (!isDownRef.current || !el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
      e.preventDefault();
      el.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const onMouseUpOrLeave = () => {
    isDownRef.current = false;
  };

  const onClickCapture = (e: MouseEvent<T>) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDraggedRef.current = false;
    }
  };

  return {
    containerRef,
    dragProps: {
      onMouseDown,
      onMouseMove,
      onMouseUp: onMouseUpOrLeave,
      onMouseLeave: onMouseUpOrLeave,
      onClickCapture,
    },
  };
}
