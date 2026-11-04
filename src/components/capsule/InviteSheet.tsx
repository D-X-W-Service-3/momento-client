import { useState } from 'react';

import CapsuleRefreshIcon from '@/assets/icons/capsule-refresh.svg?react';
import linkIcon from '@/assets/icons/link.svg';
import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button';
import type { MemberRole } from '@/types/capsule';

const ROLE_TEXT: Record<MemberRole, { title: string; description: string }> = {
  participant: {
    title: '참여자를 초대해볼까요?',
    description: '아래 링크를 친구에게 공유하면 이 캡슐에 참여할 수 있어요',
  },
  receiver: {
    title: '수신자를 초대해볼까요?',
    description: '이 캡슐의 모든 편지와 사진을 볼 수 있어요',
  },
};

interface InviteSheetProps {
  open: boolean;
  onClose: () => void;
  role: MemberRole;
  inviteUrl: string;
  onRefreshLink?: () => void;
}

export default function InviteSheet({
  open,
  onClose,
  role,
  inviteUrl,
  onRefreshLink,
}: InviteSheetProps) {
  const [copied, setCopied] = useState(false);
  const text = ROLE_TEXT[role];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드를 막아둔 브라우저에서는 조용히 넘어간다.
    }
  };

  const refreshLink = () => {
    // TODO: 초대링크 재생성 API 연결
    onRefreshLink?.();
  };

  const share = async () => {
    onClose();
    // 공유 시트를 지원하지 않으면 링크 복사로 대신한다.
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({ url: inviteUrl, title: text.title });
    } catch {
      // 사용자가 공유를 취소한 경우
    }
  };

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
              <span className="truncate">{inviteUrl}</span>
            </p>
            <button
              type="button"
              onClick={copyLink}
              aria-label="초대링크 복사"
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-fill-muted"
            >
              <img src={linkIcon} alt="" className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={refreshLink}
              aria-label="초대링크 재생성"
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-fill-muted"
            >
              <CapsuleRefreshIcon className="size-[14px]" />
            </button>
          </div>

          <Button onClick={share}>
            {copied ? '링크를 복사했어요' : '공유하기'}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
