import type { CapsuleMember } from '@/types/capsule';

interface AvatarGroupProps {
  members: CapsuleMember[];
  /** 전체 인원. members 보다 많으면 마지막에 +N 으로 표시한다. */
  totalCount: number;
  /** 아바타를 최대 몇 개까지 보여줄지 */
  max?: number;
}

export default function AvatarGroup({
  members,
  totalCount,
  max = 5,
}: AvatarGroupProps) {
  const visible = members.slice(0, max);
  const restCount = totalCount - visible.length;

  return (
    <ul className="flex w-full items-center gap-stack">
      {visible.map((member) => (
        <li key={member.id} className="shrink-0">
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="size-10 rounded-full object-cover"
          />
        </li>
      ))}
      {restCount > 0 && (
        <li className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-label font-medium text-on-primary">
          +{restCount}
        </li>
      )}
    </ul>
  );
}
