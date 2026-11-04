import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import capsuleDeleteIcon from '@/assets/icons/capsule-delete-on-dark.svg';
import capsuleEditIcon from '@/assets/icons/capsule-edit-on-dark.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import AvatarGroup from '@/components/common/AvatarGroup';
import CapsuleHero from '@/components/capsule/CapsuleHero';
import Chip from '@/components/common/Chip';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import GhostButton from '@/components/common/GhostButton';
import InviteSheet from '@/components/capsule/InviteSheet';
import LetterViewer from '@/components/capsule/LetterViewer';
import SectionHeader from '@/components/common/SectionHeader';
import BackHeader from '@/components/layout/BackHeader';
import {
  capsuleEditPath,
  capsuleParticipantsPath,
  capsuleReceiversPath,
  letterTypePath,
  ROUTES,
} from '@/constants/routes';
import { useCapsuleDetail, useDeleteCapsule } from '@/hooks/useCapsule';
import { useDeleteLetter, useMyLetters } from '@/hooks/useLetter';
import type { CapsuleInviteRole } from '@/types/capsule';
import {
  canInviteRole,
  capsuleIconSrc,
  capsuleStatusChip,
} from '@/utils/capsule';
import { formatDotDate } from '@/utils/date';

const ADMIN_ACTIONS = [
  { key: 'edit', icon: capsuleEditIcon, label: '타임캡슐 수정하기' },
  { key: 'delete', icon: capsuleDeleteIcon, label: '타임캡슐 삭제하기' },
] as const;

export default function CapsuleDetailPage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data: capsule } = useCapsuleDetail(capsuleId);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [lettersOpen, setLettersOpen] = useState(
    () => params.get('view') === 'my-letters',
  );
  const [deletingLetterId, setDeletingLetterId] = useState<string>();
  const [inviteRole, setInviteRole] = useState<CapsuleInviteRole>();

  // 편지를 모으는 중(WRITING)일 때만 편지·초대·관리 기능을 노출한다.
  // 봉인된 뒤에는 참여자/수신자만 보여주고, 내용 블록을 화면 아래에 붙인다.
  const isEditable = capsule?.status === 'WRITING';
  const permissions = capsule?.permissions;
  const chip = capsule && capsuleStatusChip(capsule.status);

  const { data: myLetters } = useMyLetters(capsuleId, isEditable);
  const deleteLetter = useDeleteLetter(capsuleId);
  const deleteCapsule = useDeleteCapsule(capsuleId);

  const hasMyLetters = (myLetters ?? []).length > 0;

  const handleConfirmDeleteLetter = () => {
    if (!deletingLetterId || deleteLetter.isPending) return;
    if (
      !myLetters?.find((letter) => letter.id === deletingLetterId)?.canDelete
    ) {
      setDeletingLetterId(undefined);
      return;
    }
    deleteLetter.mutate(deletingLetterId, {
      onSuccess: () => {
        setDeletingLetterId(undefined);
        setLettersOpen(false);
      },
    });
  };

  const handleConfirmDeleteCapsule = () => {
    deleteCapsule.mutate(undefined, {
      onSuccess: () => {
        setDeleteOpen(false);
        navigate(ROUTES.CAPSULE, { replace: true });
      },
    });
  };

  const handleAdminAction = (key: (typeof ADMIN_ACTIONS)[number]['key']) => {
    if (key === 'edit') navigate(capsuleEditPath(capsuleId));
    if (key === 'delete') setDeleteOpen(true);
  };

  const adminActions = ADMIN_ACTIONS.filter(
    (action) => action.key !== 'delete' || permissions?.canDelete,
  );

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-capsule-bg-from to-capsule-bg-to">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <BackHeader tone="dark" />

        {capsule && chip && permissions && (
          <main
            className={`flex flex-col items-center p-5 ${
              isEditable ? 'gap-card' : 'mt-auto gap-section'
            }`}
          >
            <CapsuleHero
              src={capsuleIconSrc(capsule.iconType)}
              size={isEditable ? 'md' : 'lg'}
            />

            <section className="flex w-full flex-col gap-list">
              <div className="flex w-full items-end justify-between gap-list">
                <div className="flex min-w-0 flex-col gap-stack">
                  <div className="flex gap-stack">
                    <Chip tone={chip.tone} className="font-display">
                      {chip.label}
                    </Chip>
                    {capsule.capsuleType === 'GROUP' && (
                      <Chip tone={chip.groupTone} className="font-display">
                        그룹캡슐
                      </Chip>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-title-sm font-semibold text-on-primary">
                      {capsule.title}
                    </h1>
                    <p className="font-display text-meta whitespace-pre-line text-on-primary/70">
                      {capsule.description}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end justify-end font-display text-meta whitespace-nowrap text-on-primary/50">
                  <p>
                    {capsule.memberCount}명 | 편지 {capsule.letterCount}
                  </p>
                  <p>{formatDotDate(capsule.openAt)} 개봉</p>
                </div>
              </div>

              <hr className="h-px w-full border-0 bg-white/10" />
            </section>

            <div className="flex w-full flex-col gap-section">
              {isEditable && (
                <section className="flex flex-col gap-list">
                  <SectionHeader
                    title="편지"
                    count={`${capsule.letterCount}통`}
                  />
                  <GhostButton onClick={() => setLettersOpen(true)}>
                    내가 쓴 편지 확인/삭제 하기
                  </GhostButton>
                </section>
              )}

              <section className="flex flex-col gap-list">
                <SectionHeader
                  title="참여자"
                  count={`${capsule.participants.count}명`}
                  onViewAll={() => navigate(capsuleParticipantsPath(capsuleId))}
                />
                <AvatarGroup
                  members={capsule.participants.previews}
                  totalCount={capsule.participants.count}
                />
                {permissions.canInvite &&
                  canInviteRole(capsule.capsuleType, 'PARTICIPANT') && (
                    <GhostButton onClick={() => setInviteRole('PARTICIPANT')}>
                      참여자 초대
                    </GhostButton>
                  )}
              </section>

              <section className="flex flex-col gap-list">
                <SectionHeader
                  title="수신자"
                  count={`${capsule.recipients.count}명`}
                  onViewAll={() => navigate(capsuleReceiversPath(capsuleId))}
                />
                <AvatarGroup
                  members={capsule.recipients.previews}
                  totalCount={capsule.recipients.count}
                />
                {permissions.canInvite &&
                  canInviteRole(capsule.capsuleType, 'RECIPIENT') && (
                    <GhostButton onClick={() => setInviteRole('RECIPIENT')}>
                      수신자 초대
                    </GhostButton>
                  )}
              </section>

              {permissions.canManage && (
                <section className="flex flex-col gap-list">
                  <SectionHeader title="타임캡슐 관리" note="(방장전용)" />
                  <ul className="flex flex-col divide-y divide-white/10 rounded-xl bg-white/10 px-5 py-1">
                    {adminActions.map((action) => (
                      <li key={action.key}>
                        <button
                          type="button"
                          onClick={() => handleAdminAction(action.key)}
                          className="flex w-full items-center justify-between py-3"
                        >
                          <span className="flex items-center gap-stack font-display text-list-item text-on-primary">
                            <img
                              src={action.icon}
                              alt=""
                              className="size-5 shrink-0"
                            />
                            {action.label}
                          </span>
                          <img
                            src={chevronRightIcon}
                            alt=""
                            className="h-2.5 w-[5.75px]"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </main>
        )}
      </div>

      <LetterViewer
        open={lettersOpen && hasMyLetters}
        letters={myLetters ?? []}
        onClose={() => setLettersOpen(false)}
        onDelete={(letterId) => setDeletingLetterId(letterId)}
      />

      <ConfirmDialog
        open={lettersOpen && myLetters !== undefined && !hasMyLetters}
        title="내가 작성한 편지가 없어요"
        description={
          permissions?.canWriteLetter
            ? '새로운 편지를 작성할까요?'
            : '이 캡슐에는 편지를 작성할 수 없어요.'
        }
        cancelLabel="닫기"
        confirmLabel={permissions?.canWriteLetter ? '작성하러 가기' : '확인'}
        confirmTone="primary"
        onCancel={() => setLettersOpen(false)}
        onConfirm={() => {
          setLettersOpen(false);
          if (permissions?.canWriteLetter) navigate(letterTypePath(capsuleId));
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingLetterId)}
        title="작성한 편지를 삭제할까요?"
        description="삭제한 편지는 되돌릴 수 없어요."
        cancelLabel="취소"
        confirmLabel="삭제"
        onCancel={() => setDeletingLetterId(undefined)}
        onConfirm={handleConfirmDeleteLetter}
      />

      <InviteSheet
        open={Boolean(inviteRole)}
        onClose={() => setInviteRole(undefined)}
        capsuleId={capsuleId}
        role={inviteRole ?? 'PARTICIPANT'}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="캡슐을 삭제할까요?"
        description="안에 담긴 편지와 사진도 함께 사라져요"
        cancelLabel="취소"
        confirmLabel="삭제"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDeleteCapsule}
      />
    </div>
  );
}
