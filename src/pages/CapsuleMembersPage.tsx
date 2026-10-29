import { useState } from 'react';
import { useParams } from 'react-router-dom';

import personIcon from '@/assets/icons/person.svg';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import InfoNote from '@/components/common/InfoNote';
import MemberGridItem from '@/components/common/MemberGridItem';
import BackHeader from '@/components/layout/BackHeader';
import { useCapsuleDetail } from '@/hooks/useCapsule';
import type { CapsuleMember } from '@/types/capsule';

export type MemberRole = 'participant' | 'receiver';

interface RoleContent {
  headerTitle: string;
  title: string;
  /** 두 줄 고정 설명 */
  description: [string, string];
  countLabel: string;
  inviteLabel: string;
  /** 잠금 안내 두 줄 */
  lockNote: [string, string];
  removeTitle: string;
  removeDescription: string;
}

const ROLE_CONTENT: Record<MemberRole, RoleContent> = {
  participant: {
    headerTitle: '참여자 관리',
    title: '이 타임캡슐의 참여자에요',
    description: [
      '타임캡슐의 참여자는 캡슐에 참여해',
      '자신의 편지와 사진을 남길 수 있어요',
    ],
    countLabel: '참여자',
    inviteLabel: '참여자 초대',
    lockNote: ['캡슐이 잠긴 이후에는 참여자를 초대하거나', '내보낼 수 없어요'],
    removeTitle: '참여자를 내보낼까요?',
    removeDescription: '참여자가 등록한 모든 편지와 사진이 삭제돼요',
  },
  receiver: {
    headerTitle: '수신자 관리',
    title: '이 타임캡슐의 수신자에요',
    description: [
      '타임캡슐의 참여자는 편지와 사진을 남길 수 없지만,',
      '개봉일 이후 모든 편지와 사진을 볼 수 있어요',
    ],
    countLabel: '수신자',
    inviteLabel: '수신자 초대',
    lockNote: ['캡슐이 잠긴 이후에는 수신자를 초대하거나', '내보낼 수 없어요'],
    removeTitle: '수신자를 내보낼까요?',
    removeDescription: '다시 초대하기 전까지 캡슐에 참여할 수 없어요',
  },
};

const SHARED_NOTE =
  '수신자로 지정되지 않은 참여자는 자신이 등록한 편지와 사진만 볼 수 있어요';

interface CapsuleMembersPageProps {
  role: MemberRole;
}

/**
 * 참여자 / 수신자 관리.
 * 캡슐이 잠기기 전(writing)에만 내보내기와 초대가 가능하다.
 */
export default function CapsuleMembersPage({ role }: CapsuleMembersPageProps) {
  const { capsuleId = '' } = useParams();
  const { data: capsule } = useCapsuleDetail(capsuleId);
  const [removing, setRemoving] = useState<CapsuleMember>();

  const content = ROLE_CONTENT[role];
  const editable = capsule?.status === 'writing';
  const members =
    (role === 'participant' ? capsule?.participants : capsule?.receivers) ?? [];

  return (
    <div className="min-h-[100dvh] bg-surface-muted">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <BackHeader title={content.headerTitle} />

        <main className="flex flex-1 flex-col justify-between px-5 pb-5">
          <div className="flex flex-col gap-card">
            <div className="flex flex-col gap-1">
              {/* 화면 제목(h1)은 BackHeader 가 담당한다 */}
              <h2 className="font-display text-title-md font-bold text-ink">
                {content.title}
              </h2>
              <p className="font-display text-meta text-ink-muted">
                {content.description[0]}
                <br />
                {content.description[1]}
              </p>
            </div>

            <section className="flex w-full flex-col gap-list rounded-xl bg-surface p-card">
              <h3 className="flex items-center gap-stack text-button font-semibold text-ink">
                <img src={personIcon} alt="" className="size-4 shrink-0" />
                <span className="flex items-center gap-1">
                  {content.countLabel}
                  <span className="text-ink-muted">{members.length}명</span>
                </span>
              </h3>

              <ul className="grid w-full grid-cols-4 justify-items-center gap-x-[19px] gap-y-list">
                {members.map((member) => (
                  <li key={member.id}>
                    <MemberGridItem
                      member={member}
                      onRemove={
                        editable && !member.isOwner
                          ? () => setRemoving(member)
                          : undefined
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>

            <InfoNote>
              <p>
                {content.lockNote[0]}
                <br />
                {content.lockNote[1]}
              </p>
              <p>{SHARED_NOTE}</p>
            </InfoNote>
          </div>

          {/* TODO: 초대 바텀시트 연결 */}
          <Button disabled={!editable}>{content.inviteLabel}</Button>
        </main>
      </div>

      {/* TODO: 내보내기 API 연결 */}
      <ConfirmDialog
        open={Boolean(removing)}
        title={content.removeTitle}
        description={content.removeDescription}
        cancelLabel="취소"
        confirmLabel="내보내기"
        onCancel={() => setRemoving(undefined)}
        onConfirm={() => setRemoving(undefined)}
      />
    </div>
  );
}
