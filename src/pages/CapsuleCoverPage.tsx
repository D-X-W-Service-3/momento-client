import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import CapsuleCoverLayout from '@/components/common/CapsuleCoverLayout';
import LetterViewer from '@/components/common/LetterViewer';
import { capsuleDetailPath, letterPaperPath } from '@/constants/routes';
import { useCapsuleCover } from '@/hooks/useCapsule';
import { useCapsuleLetters } from '@/hooks/useLetter';
import type { CapsuleStatus } from '@/types/calendar';
import { getDDay } from '@/utils/date';

type CoverActionKey = 'detail' | 'write' | 'letters';

interface CoverAction {
  key: CoverActionKey;
  label: string;
  variant: 'primary' | 'secondary';
}

interface CoverContent {
  /** 두 줄로 고정된 대제목 */
  titleLines: [string, string];
  actions: CoverAction[];
}

const getCoverContent = (
  status: CapsuleStatus,
  daysLeft: number,
): CoverContent => {
  switch (status) {
    case 'sealed':
      return {
        titleLines: [`${daysLeft}일 후에`, '타임캡슐이 열려요'],
        actions: [
          { key: 'detail', label: '캡슐 정보보기', variant: 'primary' },
        ],
      };
    case 'openable':
      return {
        titleLines: ['편지를 눌러', '캡슐에 담긴 추억을 확인해보세요'],
        actions: [
          { key: 'detail', label: '캡슐 정보보기', variant: 'secondary' },
          { key: 'letters', label: '편지보기', variant: 'primary' },
        ],
      };
    case 'writing':
      return {
        titleLines: ['친구들의 편지가', '차근차근 모이고 있어요'],
        actions: [
          { key: 'detail', label: '캡슐 정보보기', variant: 'secondary' },
          { key: 'write', label: '나도 편지 작성하기', variant: 'primary' },
        ],
      };
  }
};

// 어두운 배경 전용 CTA 색. 공용 Button 토큰 대신 캡슐 전용 보라를 쓴다.
const ACTION_STYLES: Record<CoverAction['variant'], string> = {
  primary: 'bg-capsule-accent text-on-primary',
  secondary: 'bg-surface text-capsule-accent',
};

/** 캡슐 상세 진입 화면. 상태(writing/sealed/openable)에 따라 문구와 버튼만 달라진다. */
export default function CapsuleCoverPage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();
  const { data: capsule } = useCapsuleCover(capsuleId);
  const [lettersOpen, setLettersOpen] = useState(false);
  const { data: letters } = useCapsuleLetters(capsuleId, lettersOpen);

  const content = capsule
    ? getCoverContent(capsule.status, getDDay(capsule.openDate))
    : null;

  const handleAction = (key: CoverActionKey) => {
    if (key === 'detail') navigate(capsuleDetailPath(capsuleId));
    if (key === 'write') navigate(letterPaperPath(capsuleId));
    if (key === 'letters') setLettersOpen(true);
  };

  return (
    <>
      {content && (
        <CapsuleCoverLayout titleLines={content.titleLines}>
          {content.actions.map((action) => (
            <Button
              key={action.key}
              variant="plain"
              className={ACTION_STYLES[action.variant]}
              onClick={() => handleAction(action.key)}
            >
              {action.label}
            </Button>
          ))}
        </CapsuleCoverLayout>
      )}

      <LetterViewer
        open={lettersOpen}
        letters={letters ?? []}
        onClose={() => setLettersOpen(false)}
      />
    </>
  );
}
