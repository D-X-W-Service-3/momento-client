import linkIcon from '@/assets/icons/link.svg';
import regenerateIcon from '@/assets/icons/invite-regenerate.svg';
import { inviteUrlOf } from '@/apis/capsule';
import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button';
import { useInviteLink } from '@/hooks/useCapsule';
import { useInviteSharing } from '@/hooks/useInviteSharing';
import { useInviteRegeneration } from '@/hooks/useInviteRegeneration';
import type { CapsuleInviteRole } from '@/types/capsule';

const ROLE_TEXT: Record<
  CapsuleInviteRole,
  { title: string; description: string }
> = {
  PARTICIPANT: {
    title: '참여자를 초대해볼까요?',
    description:
      '아래 링크를 친구에게 공유하면 누구나 이 캡슐에 참여할 수 있어요.',
  },
  RECIPIENT: {
    title: '수신자를 초대해볼까요?',
    description: '이 캡슐의 모든 편지와 사진을 볼 수 있어요.',
  },
};
interface InviteSheetProps {
  open: boolean;
  onClose: () => void;
  capsuleId: string;
  role: CapsuleInviteRole;
}
export default function InviteSheet({
  open,
  onClose,
  capsuleId,
  role,
}: InviteSheetProps) {
  const {
    data: invite,
    isPending,
    error: inviteError,
  } = useInviteLink(capsuleId, role, open);
  const regeneration = useInviteRegeneration(open, capsuleId, role);
  const text = ROLE_TEXT[role];
  const inviteUrl = invite ? inviteUrlOf(invite.inviteToken) : '';
  const disabled = !inviteUrl || regeneration.isPending;
  const { copied, error, copyLink, share } = useInviteSharing(
    open,
    inviteUrl,
    text.title,
    onClose,
  );
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-1 text-center">
          <h2 className="font-display text-title-md font-bold text-black">
            {text.title}
          </h2>
          <p className="font-display text-meta text-ink-muted">
            {text.description}
          </p>
        </div>
        <div className="flex w-full flex-col gap-list">
          <p className="font-display text-field-label font-medium text-field-ink">
            초대링크
          </p>
          <div className="flex w-full items-center gap-2">
            <p className="flex h-9 min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-border-default px-4 font-display text-button-sm leading-[1.6] text-ink-faint">
              <span className="truncate">
                {regeneration.isPending
                  ? '링크를 재생성하고 있어요'
                  : !inviteUrl && isPending
                    ? '링크를 만들고 있어요'
                    : inviteUrl}
              </span>
            </p>
            <button
              type="button"
              onClick={copyLink}
              disabled={disabled}
              aria-label="초대 링크 복사"
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-fill-muted disabled:opacity-50"
            >
              <img src={linkIcon} alt="" className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => void regeneration.regenerate()}
              disabled={disabled}
              aria-label="초대 링크 재생성"
              aria-busy={regeneration.isPending}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-fill-muted disabled:opacity-50"
            >
              <img
                src={regenerateIcon}
                alt=""
                className={`size-[14px] ${regeneration.isPending ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
          <Button onClick={share} disabled={disabled}>
            {copied ? '링크를 복사했어요' : '공유하기'}
          </Button>
          <span className="sr-only" role="status">
            {regeneration.isSuccess ? '초대 링크가 재생성됐어요' : ''}
          </span>
          {(inviteError || regeneration.error || error) && (
            <p role="alert" className="text-meta text-danger">
              {regeneration.error?.message || inviteError?.message || error}
            </p>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
