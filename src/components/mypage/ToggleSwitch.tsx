interface ToggleSwitchProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
}

export default function ToggleSwitch({
  checked,
  onToggle,
  label,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors ${
        checked ? 'bg-primary justify-end' : 'justify-start bg-gray-400'
      }`}
    >
      <span className="bg-surface-white h-[26px] w-[26px] rounded-full transition-transform" />
    </button>
  );
}
