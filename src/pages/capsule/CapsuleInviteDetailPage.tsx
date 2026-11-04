import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import AvatarGroup from '@/components/common/AvatarGroup';
import Button from '@/components/common/Button';
import CapsuleHero from '@/components/capsule/CapsuleHero';
import CapsuleInfoBlock from '@/components/capsule/CapsuleInfoBlock';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SectionHeader from '@/components/common/SectionHeader';
import BackHeader from '@/components/layout/BackHeader';
import { capsuleDetailPath, ROUTES } from '@/constants/routes';
import {
  useAcceptInvite,
  useInvitePreview,
  useRejectInvite,
} from '@/hooks/useCapsule';
import type { CapsuleInviteRole } from '@/types/capsule';
import { capsuleIconSrc, capsuleStatusChip } from '@/utils/capsule';

const ROLE_CHIP: Record<CapsuleInviteRole, string> = {
  PARTICIPANT: '참여자로 초대됐어요',
  RECIPIENT: '수신자로 초대됐어요',
};

/** 초대 수락 전에 캡슐 내용을 확인하는 화면 */
export default function CapsuleInviteDetailPage() {
  const { inviteToken = '' } = useParams();
  const navigate = useNavigate();
  const { data: preview } = useInvitePreview(inviteToken);
  const acceptInvite = useAcceptInvite(inviteToken);
  const rejectInvite = useRejectInvite(inviteToken);
  const [rejectOpen, setRejectOpen] = useState(false);

  if (!preview) return null;

  const { capsule, targetRole } = preview;
  const capsuleId = String(capsule.capsuleId);
  if (preview.alreadyJoined) {
    return <Navigate to={capsuleDetailPath(capsuleId)} replace />;
  }
  const statusChip = capsuleStatusChip(capsule.status);

  const accept = () =>
    acceptInvite.mutate(undefined, {
      onSuccess: () =>
        navigate(capsuleDetailPath(capsuleId), { replace: true }),
    });

  const reject = () =>
    rejectInvite.mutate(undefined, {
      onSuccess: () => {
        setRejectOpen(false);
        navigate(ROUTES.HOME, { replace: true });
      },
    });

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-capsule-bg-from to-capsule-bg-to">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <BackHeader tone="dark" />

        <main className="flex flex-1 flex-col justify-between px-5 pb-5">
          <div className="flex flex-col items-center gap-section pt-[45px]">
            <CapsuleHero src={capsuleIconSrc(capsule.iconType)} size="lg" />

            <CapsuleInfoBlock
              capsule={capsule}
              chips={[
                { label: statusChip.label, tone: statusChip.tone },
                { label: ROLE_CHIP[targetRole], tone: 'warning' },
              ]}
            />

            <div className="flex w-full flex-col gap-section">
              <section className="flex flex-col gap-list">
                <SectionHeader
                  title="참여자"
                  count={`${capsule.participants.count}명`}
                />
                <AvatarGroup
                  members={capsule.participants.previews}
                  totalCount={capsule.participants.count}
                />
              </section>

              <section className="flex flex-col gap-list">
                <SectionHeader
                  title="수신자"
                  count={`${capsule.recipients.count}명`}
                />
                <AvatarGroup
                  members={capsule.recipients.previews}
                  totalCount={capsule.recipients.count}
                />
              </section>
            </div>
          </div>

          <div className="flex w-full gap-[9px] pt-section">
            <Button
              variant="plain"
              className="border border-border-default bg-surface text-capsule-accent"
              onClick={() => setRejectOpen(true)}
            >
              거절하기
            </Button>
            <Button
              variant="plain"
              className="bg-capsule-accent text-on-primary"
              onClick={accept}
              disabled={acceptInvite.isPending}
            >
              수락하기
            </Button>
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={rejectOpen}
        title="초대를 거절할까요?"
        description="다시 초대받기 전까지 캡슐에 참여할 수 없어요"
        cancelLabel="취소"
        confirmLabel="삭제"
        confirmTone="primary"
        onCancel={() => setRejectOpen(false)}
        onConfirm={reject}
      />
    </div>
  );
}
