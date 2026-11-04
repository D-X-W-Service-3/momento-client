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
      <div className="mx-auto max-w-md p-5">
        <BackHeader title="편지 작성" />
        <p role={error ? 'alert' : 'status'}>
          {error?.message ?? '작성 권한을 확인하고 있어요...'}
        </p>
      </div>
    );
  }
  if (!capsule.permissions.canWriteLetter) {
    return <Navigate to={capsuleDetailPath(capsuleId)} replace />;
  }
  return <>{children}</>;
}
