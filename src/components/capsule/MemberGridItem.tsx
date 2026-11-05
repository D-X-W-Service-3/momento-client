import removeIcon from '@/assets/icons/remove-participant.svg';
import defaultAvatar from '@/assets/images/default-avatar.png';
import type { CapsuleMember } from '@/types/capsule';
import { toSecureImageUrl } from '@/utils/image';

interface MemberGridItemProps {
  member: CapsuleMember;
  /** 넘기면 아바타 우측 상단에 내보내기 버튼이 생긴다 */
  onRemove?: () => void;
}

export default function MemberGridItem({
  member,
  onRemove,
}: MemberGridItemProps) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-stack">
      <div className="relative size-16">
        <img
          src={toSecureImageUrl(member.profileImageUrl) ?? defaultAvatar}
          alt=""
          className="size-full rounded-full border border-surface object-cover"
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`${member.nickname} 내보내기`}
            className="absolute top-0 right-0 size-4"
          >
            {/* 아이콘 SVG 가 그림자까지 포함해 32px 라 바깥으로 넘겨 그린다 */}
            <img
              src={removeIcon}
              alt=""
              className="absolute inset-[-37.5%_-50%_-62.5%_-50%] max-w-none"
            />
          </button>
        )}
      </div>
      <p className="flex w-full min-w-0 items-center justify-center font-display text-meta text-ink">
        <span className="min-w-0 truncate">{member.nickname}</span>
        {member.isOwner && (
          <span className="shrink-0 text-label font-medium text-ink-muted">
            (관리자)
          </span>
        )}
      </p>
    </div>
  );
}
