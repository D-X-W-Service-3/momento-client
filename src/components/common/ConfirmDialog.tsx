import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useLayoutEffect,
  useRef,
} from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  /** 오른쪽 강조 버튼 문구 */
  confirmLabel: string;
  /** danger: 되돌릴 수 없는 파괴적 행동 (기본) */
  confirmTone?: 'danger' | 'primary';
  /** 왼쪽 테두리 버튼 문구 (기본 '취소') */
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

/**
 * 사용자의 확인을 받는 공용 다이얼로그 모달.
 * 파괴적 행동(오른쪽)은 danger 로 채우고, 일반 확인은 confirmTone="primary" 를 사용한다.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmTone = 'danger',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const titleId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement;
    cancelButtonRef.current?.focus({ preventScroll: true });

    // 모달 뒤 화면이 스크롤되지 않게 막는다.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onCancel();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]',
      ),
    ).filter(
      (element) =>
        element.tabIndex >= 0 &&
        !element.matches(':disabled') &&
        element.getClientRects().length > 0,
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const edge = event.shiftKey ? first : last;
    if (document.activeElement !== edge) return;

    event.preventDefault();
    (event.shiftKey ? last : first)?.focus();
  };

  if (!open) return null;

  return (
    <div
      className="modal-enter fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) event.preventDefault();
      }}
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        onClick={(event) => event.stopPropagation()}
        className="modal-panel-enter flex w-[300px] flex-col items-center gap-6 rounded-2xl bg-surface px-5 pt-8 pb-5"
      >
        <div className="flex w-full flex-col gap-stack text-center">
          <h2
            id={titleId}
            className="font-display text-dialog-title font-bold text-neutral-solid"
          >
            {title}
          </h2>
          {description && (
            <p className="font-display text-dialog-body text-neutral-weak">
              {description}
            </p>
          )}
        </div>

        {children}

        <div className="flex w-full gap-2.5">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="h-11 flex-1 cursor-pointer rounded-button border border-stroke-muted text-button-xs font-semibold text-neutral-weak"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-11 flex-1 cursor-pointer rounded-button text-button-xs font-semibold text-on-primary ${
              confirmTone === 'danger' ? 'bg-danger' : 'bg-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
