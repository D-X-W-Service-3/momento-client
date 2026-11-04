import FilterChips from '@/components/common/FilterChips';
import type {
  CapsuleFilterChipOption,
  CapsuleFilterKey,
} from '@/types/capsule';

interface CapsuleFilterChipsProps {
  options: CapsuleFilterChipOption[];
  selected: CapsuleFilterKey;
  onSelect: (key: CapsuleFilterKey) => void;
}
export default function CapsuleFilterChips(props: CapsuleFilterChipsProps) {
  return <FilterChips {...props} />;
}
