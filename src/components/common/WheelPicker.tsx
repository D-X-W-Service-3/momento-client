import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type PointerEvent,
} from 'react';

interface WheelPickerProps {
  label: string;
  options: string[];
  selected: number;
  onSelect: (index: number) => void;
}

const ROW_HEIGHT = 44;
const TRACKPAD_STEP_DELTA = 24;
const DISCRETE_WHEEL_DELTA = 40;

/** 터치 스크롤·마우스 휠·마우스 드래그로 가운데 행을 선택하는 유한 휠. */
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
  const wheelState = useRef({ delta: 0, lastTime: 0 });
  const stateRef = useRef({ selected, onSelect, length: options.length });

  useLayoutEffect(() => {
    stateRef.current = { selected, onSelect, length: options.length };
  });

  const clamp = (index: number) =>
    Math.max(0, Math.min(stateRef.current.length - 1, index));

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
      stateRef.current.onSelect(next);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;
      event.preventDefault();
      event.stopPropagation();

      const now = performance.now();
      if (now - wheelState.current.lastTime > 150) {
        wheelState.current.delta = 0;
      }
      wheelState.current.lastTime = now;

      let steps = 0;
      if (
        event.deltaMode !== 0 ||
        Math.abs(event.deltaY) >= DISCRETE_WHEEL_DELTA
      ) {
        steps = Math.sign(event.deltaY);
        wheelState.current.delta = 0;
      } else {
        wheelState.current.delta += event.deltaY;
        if (Math.abs(wheelState.current.delta) >= TRACKPAD_STEP_DELTA) {
          steps = Math.trunc(wheelState.current.delta / TRACKPAD_STEP_DELTA);
          wheelState.current.delta -= steps * TRACKPAD_STEP_DELTA;
        }
      }

      if (steps === 0) return;
      const current = lastSelected.current ?? stateRef.current.selected;
      const next = Math.max(
        0,
        Math.min(stateRef.current.length - 1, current + steps),
      );
      el.scrollTop = next * ROW_HEIGHT;
      if (lastSelected.current !== next) {
        lastSelected.current = next;
        stateRef.current.onSelect(next);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const { startY, scrollTop } = drag.current;
    drag.current = null;
    const el = event.currentTarget;
    const moved = Math.abs(event.clientY - startY) >= 4;
    const rect = el.getBoundingClientRect();
    const clickedOffset =
      Math.floor((event.clientY - rect.top) / ROW_HEIGHT) - 1;
    const index = clamp(
      moved
        ? Math.round(el.scrollTop / ROW_HEIGHT)
        : Math.round(scrollTop / ROW_HEIGHT) + clickedOffset,
    );
    el.scrollTop = index * ROW_HEIGHT;
    el.style.scrollSnapType = '';
    el.style.cursor = '';
    if (el.hasPointerCapture(event.pointerId))
      el.releasePointerCapture(event.pointerId);
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
