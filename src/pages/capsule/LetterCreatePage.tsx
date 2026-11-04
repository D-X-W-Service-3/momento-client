import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import TextArea from '@/components/common/TextArea';
import TextField from '@/components/common/TextField';
import BackHeader from '@/components/layout/BackHeader';

const TITLE_MAX_LENGTH = 200;
const CONTENT_MAX_LENGTH = 500;

export default function LetterCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);

  const isDirty = Boolean(title.trim() || content.trim());

  // 쓰던 내용이 있을 때만 확인을 받는다.
  const handleBack = () => (isDirty ? setCancelOpen(true) : navigate(-1));

  return (
    <div className="min-h-[100dvh] bg-surface-gray">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <BackHeader title="편지 추가" onBack={handleBack} />

        <main className="flex flex-1 flex-col justify-between px-5 pb-5">
          <div className="flex flex-col gap-card">
            <div className="flex flex-col gap-1">
              {/* 화면 제목(h1)은 BackHeader 가 담당한다 */}
              <h2 className="font-display text-title-md font-bold text-ink">
                어떤 추억을 담아볼까요?
              </h2>
              <p className="font-display text-meta text-ink-muted">
                캡슐이 열리는 날 AI가 제작한 이미지와 함께
                <br />
                추억의 순간을 전달해 드릴게요
              </p>
            </div>

            <TextField
              label="편지 제목"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={setTitle}
              maxLength={TITLE_MAX_LENGTH}
            />

            <TextArea
              label="편지 내용"
              placeholder="편지 내용을 작성해 주세요."
              value={content}
              onChange={setContent}
              maxLength={CONTENT_MAX_LENGTH}
              className="h-[460px]"
            />
          </div>

          {/* TODO: 편지 저장 API 연결 */}
          <Button disabled={!title.trim() || !content.trim()}>
            캡슐에 담기
          </Button>
        </main>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        title="작성을 취소할까요?"
        description="저장되지 않은 내용은 복구할 수 없어요"
        cancelLabel="닫기"
        confirmLabel="취소하기"
        onCancel={() => setCancelOpen(false)}
        onConfirm={() => navigate(-1)}
      />
    </div>
  );
}
