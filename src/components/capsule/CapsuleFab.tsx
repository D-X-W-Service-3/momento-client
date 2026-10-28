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
      className="bg-fab text-text-on-primary fixed right-[max(20px,calc((100vw-393px)/2+20px))] bottom-[88px] z-25 grid h-14 w-14 cursor-pointer place-items-center rounded-full shadow-[0_6px_18px_rgb(130_115_196/0.35)]"
    >
      <PlusIcon />
    </button>
  );
}
