import CapsuleLinkIcon from '@/assets/icons/capsule-link.svg?react';
import CapsuleRefreshIcon from '@/assets/icons/capsule-refresh.svg?react';
import { textStyles } from '@/styles/tokens';

interface CapsuleInviteStepProps {
  inviteLink: string;
  onCopyLink: () => void;
  onShareLink: () => void;
}

export default function CapsuleInviteStep({
  inviteLink,
  onCopyLink,
  onShareLink,
}: CapsuleInviteStepProps) {
  return (
    <div className="flex w-full flex-col gap-4 pt-[6px]">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className={`text-black ${textStyles['heading-h2']}`}>
          참여자를 초대해볼까요?
        </h2>
        <p className={`text-text-secondary ${textStyles['body-xs']}`}>
          아래 링크를 친구에게 공유하면 이 캡슐에 참여할 수 있어요
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <strong
          className={`text-text-primary ${textStyles['body-large-semi']}`}
        >
          초대링크
        </strong>

        <div className="flex w-full items-center gap-2">
          <div className="border-border-default bg-surface-white flex h-9 min-w-0 flex-1 items-center rounded-lg border px-4">
            <span
              className={`text-text-placeholder truncate ${textStyles['body-medium']}`}
            >
              {inviteLink}
            </span>
          </div>

          <button
            type="button"
            onClick={onCopyLink}
            aria-label="링크 복사"
            className="bg-surface-muted flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md"
          >
            <CapsuleLinkIcon className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            aria-label="초대 링크 새로고침"
            className="bg-surface-muted flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md"
          >
            <CapsuleRefreshIcon className="h-[14px] w-[14px]" />
          </button>
        </div>

        <button
          type="button"
          onClick={onShareLink}
          className={`bg-primary text-text-on-primary flex h-[52px] w-full cursor-pointer items-center justify-center rounded-lg px-4 ${textStyles['button-label']}`}
        >
          공유하기
        </button>
      </div>
    </div>
  );
}
