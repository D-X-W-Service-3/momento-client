import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AnniversaryForm from '@/components/anniversary/AnniversaryForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { BackHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import { useMomentoStore } from '@/stores/useMomentoStore';

export default function AnniversaryFormPage() {
  const { anniversaryId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(anniversaryId);
  const anniversaries = useMomentoStore((state) => state.anniversaries);
  const addAnniversary = useMomentoStore((state) => state.addAnniversary);
  const updateAnniversary = useMomentoStore((state) => state.updateAnniversary);
  const deleteAnniversary = useMomentoStore((state) => state.deleteAnniversary);
  const existing = anniversaries.find(
    (item) => item.id === Number(anniversaryId),
  );
  const cancel = () => navigate('/calendar');
  const [cancelOpen, setCancelOpen] = useState(false);
  return (
    <MobileLayout>
      <div className="anniversary-page">
        <BackHeader
          title={editing ? '기념일 수정' : '기념일 생성'}
          onBack={() => setCancelOpen(true)}
        />
        <AnniversaryForm
          mode={editing ? 'edit' : 'create'}
          initialValue={editing ? existing : undefined}
          onSubmit={(value) => {
            if (existing) updateAnniversary(existing.id, value);
            else addAnniversary(value);
            navigate(`/calendar?date=${encodeURIComponent(value.date)}`);
          }}
          onDelete={() => {
            if (existing) deleteAnniversary(existing.id);
            navigate('/calendar');
          }}
        />
        <ConfirmDialog
          open={cancelOpen}
          title={editing ? '수정을 취소할까요?' : '생성을 취소할까요?'}
          description="저장되지 않은 내용은 사라져요"
          cancelLabel="닫기"
          confirmLabel="취소"
          danger
          onCancel={() => setCancelOpen(false)}
          onConfirm={cancel}
        />
      </div>
    </MobileLayout>
  );
}
