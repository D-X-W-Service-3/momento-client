import Chip, { type ChipTone } from '@/components/common/Chip';
import type { CapsuleStatus } from '@/types/calendar';

const STATE_STYLES: Record<CapsuleStatus, { label: string; tone: ChipTone }> = {
  openable: { label: '개봉 가능', tone: 'success' },
  sealed: { label: '봉인됨', tone: 'info' },
  writing: { label: '작성 중', tone: 'warning' },
};

interface CapsuleStateChipProps {
  status: CapsuleStatus;
}

export default function CapsuleStateChip({ status }: CapsuleStateChipProps) {
  const { label, tone } = STATE_STYLES[status];

  return <Chip tone={tone}>{label}</Chip>;
}
