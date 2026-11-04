import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import AnniversaryForm from '@/components/anniversary/AnniversaryForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { BackHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import { getAnniversary, toKoreanDate } from '@/apis/momento';
import {
  useDeleteAnniversary,
  useSaveAnniversary,
} from '@/hooks/useMomentoMutations';
import type { AnniversaryForm as AnniversaryFormType } from '@/types/momento';

export default function AnniversaryFormPage() {
  const { anniversaryId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(anniversaryId);
  const saveAnniversary = useSaveAnniversary(anniversaryId);
  const deleteAnniversary = useDeleteAnniversary(anniversaryId ?? '');
  const [error, setError] = useState('');
  const detailQuery = useQuery({
    queryKey: ['anniversary', anniversaryId],
    queryFn: () => getAnniversary(Number(anniversaryId)),
    enabled: editing,
    retry: false,
  });
  const existing: AnniversaryFormType | undefined =
    detailQuery.data &&
    (() => {
      const item = detailQuery.data;
      const hour = Number(item.notifyTime.slice(0, 2));
      return {
        name: item.title,
        date: toKoreanDate(item.anniversaryDate),
        yearly: item.repeatType === 'YEARLY',
        memo: item.memo ?? '',
        notification: item.notificationEnabled,
        notificationTime: `${hour < 12 ? '오전' : '오후'} ${hour % 12 || 12}:${item.notifyTime.slice(3, 5)}`,
        reminder: item.remindDaysBefore
          ? `${item.remindDaysBefore}일 전`
          : '1일 전',
      };
    })();
  const displayError = error || detailQuery.error?.message;
  const cancel = () => navigate('/calendar');
  const [cancelOpen, setCancelOpen] = useState(false);
  return (
    <MobileLayout>
      <div className="anniversary-page">
        <BackHeader
          title={editing ? '기념일 수정' : '기념일 생성'}
          onBack={() => setCancelOpen(true)}
        />
        {displayError && (
          <p className="field-error" role="alert">
            {displayError}
          </p>
        )}
        {(!editing || existing) && (
          <AnniversaryForm
            key={anniversaryId ?? 'new'}
            mode={editing ? 'edit' : 'create'}
            initialValue={existing}
            onSubmit={(value) => {
              if (saveAnniversary.isPending || deleteAnniversary.isPending)
                return;
              setError('');
              void saveAnniversary
                .mutateAsync(value)
                .then(() =>
                  navigate(`/calendar?date=${encodeURIComponent(value.date)}`),
                )
                .catch((reason: Error) => setError(reason.message));
            }}
            onDelete={() => {
              if (saveAnniversary.isPending || deleteAnniversary.isPending)
                return;
              setError('');
              void deleteAnniversary
                .mutateAsync()
                .then(() => navigate('/calendar'))
                .catch((reason: Error) => setError(reason.message));
            }}
          />
        )}
        <ConfirmDialog
          open={cancelOpen}
          title={editing ? '수정을 취소할까요?' : '생성을 취소할까요?'}
          description="저장되지 않은 내용은 사라져요"
          cancelLabel="닫기"
          confirmLabel="취소"
          onCancel={() => setCancelOpen(false)}
          onConfirm={cancel}
        />
      </div>
    </MobileLayout>
  );
}
