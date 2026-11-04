import { Navigate, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import CapsuleCoverLayout from '@/components/capsule/CapsuleCoverLayout';
import { capsuleDetailPath, inviteDetailPath } from '@/constants/routes';
import { useAcceptInvite, useInvitePreview } from '@/hooks/useCapsule';
import type { CapsuleInviteRole } from '@/types/capsule';

const ROLE_TEXT: Record<
  CapsuleInviteRole,
  { subtitle: string; acceptLabel: string }
> = {
  PARTICIPANT: {
    subtitle: '캡슐을 함께 만들어보세요',
    acceptLabel: '참여하기',
  },
  RECIPIENT: { subtitle: '캡슐에 초대됐어요', acceptLabel: '수신하기' },
};

/** 초대 링크로 들어왔을 때 보이는 캡슐 커버 */
export default function CapsuleInvitePage() {
  const { inviteToken = '' } = useParams();
  const navigate = useNavigate();
  const { data: preview } = useInvitePreview(inviteToken);
  const acceptInvite = useAcceptInvite(inviteToken);

  const capsuleId = preview ? String(preview.capsule.capsuleId) : '';

  if (!preview) return null;
  if (preview.alreadyJoined) {
    return <Navigate to={capsuleDetailPath(capsuleId)} replace />;
  }

  const text = ROLE_TEXT[preview.targetRole];

  const accept = () =>
    acceptInvite.mutate(undefined, {
      onSuccess: () =>
        navigate(capsuleDetailPath(capsuleId), { replace: true }),
    });

  return (
    <CapsuleCoverLayout titleLines={[preview.capsule.title, text.subtitle]}>
      <Button
        variant="plain"
        className="bg-surface text-capsule-accent"
        onClick={() => navigate(inviteDetailPath(inviteToken))}
      >
        캡슐 상세보기
      </Button>
      <Button
        variant="plain"
        className="bg-capsule-accent text-on-primary"
        onClick={accept}
        disabled={acceptInvite.isPending}
      >
        {text.acceptLabel}
      </Button>
    </CapsuleCoverLayout>
  );
}
