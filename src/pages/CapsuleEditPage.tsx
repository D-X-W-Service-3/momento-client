import { useState } from 'react';

import Button from '@/components/common/Button';
import CapsuleIconPicker from '@/components/common/CapsuleIconPicker';
import InfoNote from '@/components/common/InfoNote';
import TextArea from '@/components/common/TextArea';
import TextField from '@/components/common/TextField';
import BackHeader from '@/components/layout/BackHeader';
import { useCapsuleIcons } from '@/hooks/useCapsule';

const NAME_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 45;

export default function CapsuleEditPage() {
  const { data: icons } = useCapsuleIcons();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="min-h-[100dvh] bg-surface-muted">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <BackHeader title="캡슐 수정하기" />

        <main className="flex flex-1 flex-col justify-between px-5 pb-5">
          <div className="flex flex-col gap-card">
            {icons && (
              <CapsuleIconPicker icons={icons} label="아이콘 선택하기" />
            )}

            <TextField
              label="캡슐 이름"
              placeholder="캡슐 이름을 입력해주세요"
              value={name}
              onChange={setName}
              maxLength={NAME_MAX_LENGTH}
            />

            <TextArea
              label="캡슐 설명"
              placeholder="캡슐 설명을 작성해 주세요."
              value={description}
              onChange={setDescription}
              maxLength={DESCRIPTION_MAX_LENGTH}
            />

            <InfoNote>
              <p>
                캡슐이 잠겨있는 동안에는 편지, 사진 수정 및 삭제와
                <br />
                캡슐 수정, 삭제가 불가능해요
              </p>
            </InfoNote>
          </div>

          {/* TODO: 캡슐 수정 API 연결 */}
          <Button disabled={!name.trim()}>다음</Button>
        </main>
      </div>
    </div>
  );
}
