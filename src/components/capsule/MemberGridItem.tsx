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
          loading="lazy"
          decoding="async"
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
      {/*
        기본 닉네임이 "모멘토친구506357" 처럼 길게 내려온다. 한 칸(64px)에
        한 줄로 자르면 전부 "모멘토친..." 이 되어 서로 구분이 안 되므로,
        두 줄까지 흘려서 뒷자리가 보이게 한다. 그보다 길면 말줄임한다.
        관리자 표시는 아랫줄로 내려 이름을 먹지 않게 한다.
      */}
      <p className="w-full min-w-0 text-center font-display text-meta text-ink">
        <span className="line-clamp-2 break-all">{member.nickname}</span>
        {member.isOwner && (
          <span className="block text-label font-medium text-ink-muted">
            (관리자)
          </span>
        )}
      </p>
    </div>
  );
}
