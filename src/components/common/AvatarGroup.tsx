import defaultAvatar from '@/assets/images/default-avatar.png';
import type { CapsuleMemberPreview } from '@/types/capsule';
import { toSecureImageUrl } from '@/utils/image';

interface AvatarGroupProps {
  members: CapsuleMemberPreview[];
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

  if (visible.length === 0 && restCount <= 0) return null;

  return (
    <ul className="flex w-full items-center gap-stack">
      {visible.map((member) => (
        <li key={member.userId} className="shrink-0">
          <img
            src={toSecureImageUrl(member.profileImageUrl) ?? defaultAvatar}
            alt={member.nickname}
            loading="lazy"
            decoding="async"
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
