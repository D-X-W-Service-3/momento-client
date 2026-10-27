import type { ReactNode } from 'react';

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  if (!open) return null;
  return (
    <div className="sheet-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-grabber" />
        {title && <h2>{title}</h2>}
        {children}
      </section>
    </div>
  );
}
