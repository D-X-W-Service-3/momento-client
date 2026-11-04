import { useId, useLayoutEffect, useRef, type PointerEvent } from 'react';

interface WheelPickerProps {
  label: string;
  options: string[];
  selected: number;
  onSelect: (index: number) => void;
}

const ROW_HEIGHT = 44;

/** 터치 스크롤·마우스 드래그로 가운데 행을 선택하는 유한 휠. */
export default function WheelPicker({
  label,
  options,
  selected,
  onSelect,
}: WheelPickerProps) {
  const id = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSelected = useRef<number | null>(null);
  const drag = useRef<{ startY: number; scrollTop: number } | null>(null);
  const clamp = (index: number) =>
    Math.max(0, Math.min(options.length - 1, index));

  useLayoutEffect(() => {
    if (scrollRef.current && lastSelected.current !== selected) {
      scrollRef.current.scrollTop = selected * ROW_HEIGHT;
      lastSelected.current = selected;
    }
  }, [selected]);

  const select = (index: number) => {
    const next = clamp(index);
    if (lastSelected.current !== next) {
      lastSelected.current = next;
      onSelect(next);
    }
  };
  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    drag.current = null;
    const el = event.currentTarget;
    const index = clamp(Math.round(el.scrollTop / ROW_HEIGHT));
    el.style.scrollSnapType = '';
    el.style.cursor = '';
    if (el.hasPointerCapture(event.pointerId))
      el.releasePointerCapture(event.pointerId);
    el.scrollTo({ top: index * ROW_HEIGHT, behavior: 'smooth' });
    select(index);
  };

  return (
    <div className="time-wheel-column">
      <div className="time-wheel-selection" aria-hidden="true" />
      <div
        ref={scrollRef}
        role="listbox"
        aria-label={label}
        aria-orientation="vertical"
        aria-activedescendant={`${id}-${selected}`}
        tabIndex={0}
        className="time-wheel-scroll"
        onScroll={(event) =>
          select(Math.round(event.currentTarget.scrollTop / ROW_HEIGHT))
        }
        onPointerDown={(event) => {
          if (event.pointerType !== 'mouse' || event.button !== 0) return;
          event.preventDefault();
          const el = event.currentTarget;
          el.focus({ preventScroll: true });
          drag.current = { startY: event.clientY, scrollTop: el.scrollTop };
          el.style.scrollSnapType = 'none';
          el.style.cursor = 'grabbing';
          el.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current)
            event.currentTarget.scrollTop =
              drag.current.scrollTop + drag.current.startY - event.clientY;
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onKeyDown={(event) => {
          const next =
            event.key === 'ArrowDown'
              ? selected + 1
              : event.key === 'ArrowUp'
                ? selected - 1
                : event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? options.length - 1
                    : null;
          if (next === null) return;
          event.preventDefault();
          const index = clamp(next);
          event.currentTarget.scrollTop = index * ROW_HEIGHT;
          select(index);
        }}
      >
        {options.map((option, index) => (
          <div
            key={option}
            id={`${id}-${index}`}
            role="option"
            aria-selected={selected === index}
            className="time-wheel-option"
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}
