import { useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import Button from '@/components/common/Button';
import LetterPaperCard from '@/components/capsule/LetterPaperCard';
import BackHeader from '@/components/layout/BackHeader';
import { letterTypePath, letterWritePath } from '@/constants/routes';
import { useLetterPapers } from '@/hooks/useLetter';
import type { LetterType } from '@/types/letter';

export default function LetterPaperSelectPage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: papers } = useLetterPapers();
  const [selectedId, setSelectedId] = useState<string>();
  const rowCount = Math.ceil((papers?.length ?? 0) / 2);

  // 1단계에서 고른 편지 유형. 없으면 처음부터 다시 받는다.
  const letterType = (location.state as { letterType?: LetterType } | null)
    ?.letterType;

  if (!letterType) {
    return <Navigate to={letterTypePath(capsuleId)} replace />;
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-surface-gray">
      {/* 한 화면에 맞춘다: 카드 영역이 남은 높이에 맞춰 줄어들고 페이지는 스크롤되지 않는다 */}
      <div className="mx-auto flex h-full w-full max-w-app flex-col items-center gap-[9px] pb-[max(22px,env(safe-area-inset-bottom))]">
        <BackHeader title="편지 작성" />

        <div className="flex w-full flex-col gap-1 px-5">
          {/* 화면 제목(h1)은 BackHeader 가 담당한다 */}
          <h2 className="font-display text-title-md font-bold text-black">
            원하는 화풍을 선택해주세요
          </h2>
          <p className="font-display text-meta text-ink-muted">
            캡슐이 열리는 날 AI가 제작한 이미지와 함께
            <br />
            추억의 순간을 전달해 드릴게요
          </p>
        </div>

        {/* 남은 높이를 행 수로 나누되 한 행은 최대 178px(Figma). content-start 로 행이 늘어나지 않게 한다 */}
        <ul
          className="grid min-h-0 w-full flex-1 grid-cols-2 content-start gap-x-[17px] gap-y-4 px-5 pt-[19px]"
          style={{
            gridTemplateRows: `repeat(${rowCount}, minmax(0, 178px))`,
          }}
        >
          {papers?.map((paper) => (
            // Figma 카드 프레임은 168x178 — 우표(168) 아래 10px 여백이 있다.
            // 셀 크기(cq 단위) 안에 들어가는 정사각형으로 우표 크기를 정한다.
            <li
              key={paper.id}
              className="flex min-h-0 justify-center [container-type:size]"
            >
              <div className="w-[min(100cqw,calc(100cqh-10px))]">
                <LetterPaperCard
                  paper={paper}
                  selected={paper.id === selectedId}
                  onSelect={() => setSelectedId(paper.id)}
                />
              </div>
            </li>
          ))}
        </ul>

        <p className="font-display text-note whitespace-pre text-hint">
          {'ⓘ  선택한 화풍이 생성되는 이미지에 적용돼요'}
        </p>

        <div className="w-full px-5">
          <Button
            disabled={!selectedId}
            onClick={() =>
              navigate(letterWritePath(capsuleId), {
                // 고른 유형·화풍은 마지막 단계에서 함께 서버로 보낸다.
                state: { letterType, paperId: selectedId },
              })
            }
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
