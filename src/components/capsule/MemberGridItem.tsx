import removeIcon from '@/assets/icons/remove-participant.svg';
import type { CapsuleMember } from '@/types/capsule';

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
    <div className="flex flex-col items-center justify-center gap-stack">
      <div className="relative size-16">
        <img
          src={member.avatarUrl}
          alt=""
          className="size-full rounded-full border border-surface object-cover"
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`${member.name} 내보내기`}
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
      <p className="font-display text-meta whitespace-nowrap text-ink">
        {member.name}
        {member.isOwner && (
          <span className="text-label font-medium text-ink-muted">
            (관리자)
          </span>
        )}
      </p>
    </div>
  );
}
