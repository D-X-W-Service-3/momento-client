import { useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { findLetterPaper } from '@/apis/letter';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import TextArea from '@/components/common/TextArea';
import TextField from '@/components/common/TextField';
import BackHeader from '@/components/layout/BackHeader';
import { capsuleDetailPath, letterTypePath } from '@/constants/routes';
import { useCreateLetter } from '@/hooks/useLetter';
import {
  LETTER_CONTENT_MAX_LENGTH,
  LETTER_TITLE_MAX_LENGTH,
  type LetterType,
} from '@/types/letter';
import StickyBottomBar from '@/components/common/StickyBottomBar';

export default function LetterCreatePage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);
  const createLetter = useCreateLetter(capsuleId);

  // 앞선 두 단계에서 고른 값. 새로고침 등으로 없으면 처음부터 다시 받는다.
  const step = location.state as {
    letterType?: LetterType;
    paperId?: string;
  } | null;
  const paper = step?.paperId ? findLetterPaper(step.paperId) : undefined;
  const letterType = step?.letterType;

  const isDirty = Boolean(title.trim() || content.trim());

  // 쓰던 내용이 있을 때만 확인을 받는다.
  const handleBack = () => (isDirty ? setCancelOpen(true) : navigate(-1));

  const handleSubmit = () => {
    if (!paper || !letterType) return;
    createLetter.mutate(
      {
        title: title.trim(),
        content: content.trim(),
        themeType: paper.themeType,
        letterType,
      },
      {
        onSuccess: () =>
          navigate(capsuleDetailPath(capsuleId), { replace: true }),
      },
    );
  };

  if (!paper || !letterType) {
    return <Navigate to={letterTypePath(capsuleId)} replace />;
  }

  return (
    <div className="min-h-[100dvh] bg-surface-gray">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-app flex-col">
        <BackHeader title="편지 추가" onBack={handleBack} />

        <main className="flex flex-1 flex-col px-5">
          <div className="flex flex-1 flex-col gap-card">
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
              maxLength={LETTER_TITLE_MAX_LENGTH}
            />

            <TextArea
              label="편지 내용"
              placeholder="편지 내용을 작성해 주세요."
              value={content}
              onChange={setContent}
              maxLength={LETTER_CONTENT_MAX_LENGTH}
              // 화면 높이에 맞춰 남은 공간을 채운다 (최소 높이만 보장)
              className="min-h-[180px] flex-1"
            />
          </div>

          <StickyBottomBar className="bg-surface-gray">
            <Button
              disabled={
                !title.trim() || !content.trim() || createLetter.isPending
              }
              onClick={handleSubmit}
            >
              캡슐에 담기
            </Button>
          </StickyBottomBar>
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
