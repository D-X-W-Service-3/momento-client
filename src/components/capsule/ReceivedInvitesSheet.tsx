import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchReceivedInvites } from '@/apis/capsules';
import BottomSheet from '@/components/common/BottomSheet';
import QueryFeedback from '@/components/common/QueryFeedback';
import { capsuleDateLabel } from '@/utils/capsuleCards';

export default function ReceivedInvitesSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ['receivedInvites'],
    queryFn: fetchReceivedInvites,
    enabled: open,
  });
  return (
    <BottomSheet open={open} onClose={onClose} title="받은 초대">
      <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-5 pb-5">
        <QueryFeedback
          loading={query.isLoading}
          error={query.error}
          onRetry={query.refetch}
          empty={query.data?.invites.length === 0}
          emptyMessage="받은 초대가 없어요."
        />
        {query.data?.invites.map((invite) => (
          <button
            key={invite.inviteToken}
            type="button"
            className="bg-surface-gray flex flex-col gap-1 rounded-xl p-4 text-left"
            onClick={() => {
              onClose();
              navigate(`/invites/${encodeURIComponent(invite.inviteToken)}`);
            }}
          >
            <span className="text-text-secondary text-body-sm">
              {invite.inviterNickname}님의 초대 ·{' '}
              {invite.targetRole === 'RECIPIENT' ? '받는 사람' : '참여자'}
            </span>
            <strong className="text-text-primary">{invite.capsuleTitle}</strong>
            <span className="text-text-muted text-body-sm">
              {capsuleDateLabel(invite.openAt)}
            </span>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
