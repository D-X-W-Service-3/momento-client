import { PlusIcon } from '@/components/common/Icons';

interface CapsuleFabProps {
  onClick?: () => void;
}

export default function CapsuleFab({ onClick }: CapsuleFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="타임캡슐 만들기"
      className="floating-button"
    >
      <PlusIcon />
    </button>
  );
}
