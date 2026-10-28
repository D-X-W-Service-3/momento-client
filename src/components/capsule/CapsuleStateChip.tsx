import { textStyles } from '@/styles/tokens';
import type { CapsuleChipBadge, CapsuleChipTone } from '@/types/capsule';

interface CapsuleStateChipProps {
  badge: CapsuleChipBadge;
}

const toneClassMap: Record<CapsuleChipTone, string> = {
  openable: 'bg-chip-open-bg text-chip-open-text',
  editable: 'bg-chip-edit-bg text-chip-edit-text',
  locked: 'bg-primary-tint text-primary-dark',
  opened: 'bg-surface-subtle text-text-placeholder',
};

export default function CapsuleStateChip({ badge }: CapsuleStateChipProps) {
  return (
    <span
      className={`inline-flex h-6 w-fit items-center rounded-full px-[10px] py-1 ${toneClassMap[badge.tone]} ${textStyles['body-small-med']}`}
    >
      {badge.label}
    </span>
  );
}
