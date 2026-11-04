import { useNavigate } from 'react-router-dom';

import { PlusIcon } from '@/components/common/Icons';

interface CapsuleFabProps {
  onClick?: () => void;
}

export default function CapsuleFab({ onClick }: CapsuleFabProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={onClick ?? (() => navigate('/capsules/new'))}
      aria-label="타임캡슐 만들기"
      className="floating-button"
    >
      <PlusIcon />
    </button>
  );
}
