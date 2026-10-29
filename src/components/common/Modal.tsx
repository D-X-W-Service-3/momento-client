import type { ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  children?: ReactNode;
};

export default function Modal({
  open,
  title,
  description,
  cancelLabel = '취소',
  confirmLabel,
  danger = false,
  onCancel,
  onConfirm,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {children}
        <div className="modal-actions">
          <button type="button" className="button-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? 'button-danger' : 'button-primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
