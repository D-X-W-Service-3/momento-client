import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import LetterPaperCard from '@/components/common/LetterPaperCard';
import BackHeader from '@/components/layout/BackHeader';
import { letterWritePath } from '@/constants/routes';
import { useLetterPapers } from '@/hooks/useLetter';

export default function LetterPaperSelectPage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();
  const { data: papers } = useLetterPapers();
  const [selectedId, setSelectedId] = useState<string>();

  return (
    <div className="min-h-[100dvh] bg-surface-muted">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center gap-[9px] pt-[env(safe-area-inset-top)] pb-[max(24px,env(safe-area-inset-bottom))]">
        <BackHeader title="편지 작성" />

        <div className="flex w-full flex-col gap-1 px-5">
          {/* 화면 제목(h1)은 BackHeader 가 담당한다 */}
          <h2 className="font-display text-title-md font-bold text-black">
            원하는 편지지를 선택해주세요
          </h2>
          <p className="font-display text-caption text-ink-muted">
            캡슐이 열리는 날 AI가 제작한 이미지와 함께
            <br />
            추억의 순간을 전달해 드릴게요
          </p>
        </div>

        {/* flex-1 로 남은 높이를 차지하되, content-start 로 행이 늘어나지 않게 한다 */}
        <ul className="grid w-full flex-1 grid-cols-2 content-start gap-x-[17px] gap-y-4 px-5 pt-[19px]">
          {papers?.map((paper) => (
            <li key={paper.id}>
              <LetterPaperCard
                paper={paper}
                selected={paper.id === selectedId}
                onSelect={() => setSelectedId(paper.id)}
              />
            </li>
          ))}
        </ul>

        <p className="font-display text-note whitespace-pre text-hint">
          {'ⓘ  선택한 화풍이 편지지 배경에 적용돼요'}
        </p>

        <div className="w-full px-5">
          <Button
            disabled={!selectedId}
            onClick={() => navigate(letterWritePath(capsuleId))}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
