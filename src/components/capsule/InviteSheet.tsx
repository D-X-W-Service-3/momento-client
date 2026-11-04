import linkIcon from '@/assets/icons/link.svg';
import { inviteUrlOf } from '@/apis/capsule';
import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button';
import { useInviteLink } from '@/hooks/useCapsule';
import { useInviteSharing } from '@/hooks/useInviteSharing';
import type { CapsuleInviteRole } from '@/types/capsule';

const ROLE_TEXT: Record<
  CapsuleInviteRole,
  { title: string; description: string }
> = {
  PARTICIPANT: {
    title: '참여자를 초대해볼까요?',
    description:
      '아래 링크를 친구에게 공유하면 누구나 이 캡슐에 참여할 수 있어요',
  },
  RECIPIENT: {
    title: '수신자를 초대해볼까요?',
    description: '이 캡슐의 모든 편지와 사진을 볼 수 있어요',
  },
};

interface InviteSheetProps {
  open: boolean;
  onClose: () => void;
  capsuleId: string;
  role: CapsuleInviteRole;
  /**
   * 이미 손에 들고 있는 초대 링크. 캡슐 생성 완료 화면처럼 방금 받은 링크를
   * 그대로 보여줄 때만 넘긴다. 넘기면 발급 요청을 하지 않는다.
   */
  inviteUrl?: string;
}

export default function InviteSheet({
  open,
  onClose,
  capsuleId,
  role,
  inviteUrl: givenInviteUrl,
}: InviteSheetProps) {
  const {
    data: invite,
    isPending,
    error: inviteError,
  } = useInviteLink(capsuleId, role, open && !givenInviteUrl);
  const text = ROLE_TEXT[role];

  const inviteUrl =
    givenInviteUrl ?? (invite ? inviteUrlOf(invite.inviteToken) : '');

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

          <div className="flex w-full items-center gap-stack">
            <p className="flex h-9 min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-border-default px-4 font-display text-button-sm leading-[1.6] text-ink-faint">
              <span className="truncate">
                {!inviteUrl && isPending ? '링크를 만들고 있어요' : inviteUrl}
              </span>
            </p>
            <button
              type="button"
              onClick={copyLink}
              disabled={!inviteUrl}
              aria-label="초대링크 복사"
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-fill-muted disabled:opacity-50"
            >
              <img src={linkIcon} alt="" className="size-[18px]" />
            </button>
          </div>

          <Button onClick={share} disabled={!inviteUrl}>
            {copied ? '링크를 복사했어요' : '공유하기'}
          </Button>
          {(inviteError || error) && (
            <p role="alert" className="text-meta text-danger">
              {inviteError?.message || error}
            </p>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
