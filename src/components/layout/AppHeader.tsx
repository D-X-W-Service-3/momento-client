import bellIcon from '@/assets/icons/bell.svg';

export default function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-between px-5">
      <span className="font-logo text-h2 leading-[1.4] tracking-[-0.01em] text-primary-strong">
        Momento
      </span>
      <button type="button" aria-label="알림">
        <img src={bellIcon} alt="" className="size-6" />
      </button>
    </header>
  );
}
