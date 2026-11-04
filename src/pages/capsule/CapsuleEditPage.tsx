import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import CapsuleIconPicker from '@/components/capsule/CapsuleIconPicker';
import InfoNote from '@/components/common/InfoNote';
import TextArea from '@/components/common/TextArea';
import TextField from '@/components/common/TextField';
import BackHeader from '@/components/layout/BackHeader';
import {
  useCapsuleDetail,
  useCapsuleIcons,
  useUpdateCapsule,
} from '@/hooks/useCapsule';
import {
  CAPSULE_DESCRIPTION_MAX_LENGTH,
  CAPSULE_NAME_MAX_LENGTH,
} from '@/types/capsule';

export default function CapsuleEditPage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();
  const { data: icons } = useCapsuleIcons();
  const { data: capsule } = useCapsuleDetail(capsuleId);
  const updateCapsule = useUpdateCapsule(capsuleId);

  const [iconIndex, setIconIndex] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // 수정 화면이라 서버 값으로 한 번 채워준다.
  useEffect(() => {
    if (!capsule) return;
    setName(capsule.title);
    setDescription(capsule.description ?? '');
    const index = icons?.findIndex((icon) => icon.id === capsule.iconType);
    if (index !== undefined && index >= 0) setIconIndex(index);
  }, [capsule, icons]);

  const handleSubmit = () => {
    const iconType = icons?.[iconIndex]?.id ?? capsule?.iconType;
    if (!iconType) return;
    updateCapsule.mutate(
      { iconType, title: name.trim(), description: description.trim() },
      { onSuccess: () => navigate(-1) },
    );
  };

  return (
    <div className="min-h-[100dvh] bg-surface-gray">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-app flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <BackHeader title="캡슐 수정하기" />

        <main className="flex flex-1 flex-col justify-between px-5 pb-5">
          <div className="flex flex-col gap-card">
            {icons && (
              <CapsuleIconPicker
                icons={icons}
                label="아이콘 선택하기"
                selectedIndex={iconIndex}
                onSelectIndex={setIconIndex}
              />
            )}

            <TextField
              label="캡슐 이름"
              placeholder="캡슐 이름을 입력해주세요"
              value={name}
              onChange={setName}
              maxLength={CAPSULE_NAME_MAX_LENGTH}
            />

            <TextArea
              label="캡슐 설명"
              placeholder="캡슐 설명을 작성해 주세요."
              value={description}
              onChange={setDescription}
              maxLength={CAPSULE_DESCRIPTION_MAX_LENGTH}
            />

            <InfoNote>
              <p>
                캡슐이 잠겨있는 동안에는 편지, 사진 수정 및 삭제와
                <br />
                캡슐 수정, 삭제가 불가능해요
              </p>
            </InfoNote>
          </div>

          <Button
            disabled={!name.trim() || updateCapsule.isPending}
            onClick={handleSubmit}
          >
            수정하기
          </Button>
        </main>
      </div>
    </div>
  );
}
