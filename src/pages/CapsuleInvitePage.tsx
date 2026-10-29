import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import CapsuleCoverLayout from '@/components/common/CapsuleCoverLayout';
import { capsuleInviteDetailPath } from '@/constants/routes';
import { useCapsuleCover } from '@/hooks/useCapsule';
import type { MemberRole } from '@/types/capsule';

const ROLE_TEXT: Record<MemberRole, { subtitle: string; acceptLabel: string }> =
  {
    participant: {
      subtitle: '캡슐을 함께 만들어보세요',
      acceptLabel: '참여하기',
    },
    receiver: { subtitle: '캡슐에 초대됐어요', acceptLabel: '수신하기' },
  };

/** 초대 링크로 들어왔을 때 보이는 캡슐 커버 */
export default function CapsuleInvitePage() {
  const { capsuleId = '', role = 'participant' } = useParams();
  const navigate = useNavigate();
  const { data: capsule } = useCapsuleCover(capsuleId);

  const memberRole: MemberRole =
    role === 'receiver' ? 'receiver' : 'participant';
  const text = ROLE_TEXT[memberRole];

  if (!capsule) return null;

  return (
    <CapsuleCoverLayout titleLines={[capsule.title, text.subtitle]}>
      <Button
        variant="plain"
        className="bg-surface text-capsule-accent"
        onClick={() => navigate(capsuleInviteDetailPath(capsuleId, memberRole))}
      >
        캡슐 상세보기
      </Button>
      {/* TODO: 초대 수락 API 연결 */}
      <Button variant="plain" className="bg-capsule-accent text-on-primary">
        {text.acceptLabel}
      </Button>
    </CapsuleCoverLayout>
  );
}
