import QueryFeedback from '@/components/common/QueryFeedback';
import type { ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import BackHeader from '@/components/layout/BackHeader';
import { capsuleDetailPath } from '@/constants/routes';
import { useCapsuleDetail } from '@/hooks/useCapsule';

export default function RequireLetterWriting({
  children,
}: {
  children: ReactNode;
}) {
  const { capsuleId = '' } = useParams();
  const { data: capsule, error } = useCapsuleDetail(capsuleId);
  if (!capsule) {
    return (
      <div className="mx-auto max-w-app p-5">
        <BackHeader title="편지 작성" />
        <QueryFeedback loading={!error} error={error} />
      </div>
    );
  }
  if (!capsule.permissions.canWriteLetter) {
    return <Navigate to={capsuleDetailPath(capsuleId)} replace />;
  }
  return <>{children}</>;
}
