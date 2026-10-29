import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AvatarGroup from '@/components/common/AvatarGroup';
import Button from '@/components/common/Button';
import CapsuleHero from '@/components/common/CapsuleHero';
import CapsuleInfoBlock from '@/components/common/CapsuleInfoBlock';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SectionHeader from '@/components/common/SectionHeader';
import BackHeader from '@/components/layout/BackHeader';
import {
  capsuleParticipantsPath,
  capsuleReceiversPath,
} from '@/constants/routes';
import { useCapsuleDetail } from '@/hooks/useCapsule';
import type { MemberRole } from '@/types/capsule';

const ROLE_CHIP: Record<MemberRole, string> = {
  participant: '참여자로 초대됐어요',
  receiver: '수신자로 초대됐어요',
};

/** 초대 수락 전에 캡슐 내용을 확인하는 화면 */
export default function CapsuleInviteDetailPage() {
  const { capsuleId = '', role = 'participant' } = useParams();
  const navigate = useNavigate();
  const { data: capsule } = useCapsuleDetail(capsuleId);
  const [rejectOpen, setRejectOpen] = useState(false);

  const memberRole: MemberRole =
    role === 'receiver' ? 'receiver' : 'participant';

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-capsule-bg-from to-capsule-bg-to">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <BackHeader tone="dark" />

        {capsule && (
          <main className="flex flex-1 flex-col justify-between px-5 pb-5">
            <div className="flex flex-col items-center gap-section pt-[45px]">
              <CapsuleHero src={capsule.coverImageUrl} size="lg" />

              <CapsuleInfoBlock
                capsule={capsule}
                chips={[
                  { label: '수정가능', tone: 'warning' },
                  { label: ROLE_CHIP[memberRole], tone: 'warning' },
                ]}
              />

              <div className="flex w-full flex-col gap-section">
                <section className="flex flex-col gap-list">
                  <SectionHeader
                    title="참여자"
                    count={`${capsule.participantCount}명`}
                    onViewAll={() =>
                      navigate(capsuleParticipantsPath(capsuleId))
                    }
                  />
                  <AvatarGroup
                    members={capsule.participants}
                    totalCount={capsule.participantCount}
                  />
                </section>

                <section className="flex flex-col gap-list">
                  <SectionHeader
                    title="수신자"
                    count={`${capsule.receiverCount}명`}
                    onViewAll={() => navigate(capsuleReceiversPath(capsuleId))}
                  />
                  <AvatarGroup
                    members={capsule.receivers}
                    totalCount={capsule.receiverCount}
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
              {/* TODO: 초대 수락 API 연결 */}
              <Button
                variant="plain"
                className="bg-capsule-accent text-on-primary"
              >
                수락하기
              </Button>
            </div>
          </main>
        )}
      </div>

      {/* TODO: 초대 거절 API 연결 */}
      <ConfirmDialog
        open={rejectOpen}
        title="초대를 거절할까요?"
        description="다시 초대받기 전까지 캡슐에 참여할 수 없어요"
        cancelLabel="취소"
        confirmLabel="삭제"
        confirmTone="primary"
        onCancel={() => setRejectOpen(false)}
        onConfirm={() => setRejectOpen(false)}
      />
    </div>
  );
}
