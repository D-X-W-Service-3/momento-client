import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import CapsuleCoverLayout from '@/components/capsule/CapsuleCoverLayout';
import LetterViewer from '@/components/capsule/LetterViewer';
import OpeningFlash from '@/components/capsule/OpeningFlash';
import { capsuleDetailPath, letterTypePath } from '@/constants/routes';
import { useCapsuleDetail } from '@/hooks/useCapsule';
import { useCapsuleLetters } from '@/hooks/useLetter';
import type { CapsuleDetail } from '@/types/capsule';
import { openCountdownLabel, serverDate } from '@/utils/capsuleCards';

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

/**
 * 서버 status 3가지가 Figma 의 수정가능 / 잠긴캡슐 / 열린캡슐 커버와 1:1 이다.
 * 버튼 노출은 서버가 준 permissions 를 그대로 따른다.
 */
const getCoverContent = (capsule: CapsuleDetail, now: number): CoverContent => {
  const { canWriteLetter, canViewLetters } = capsule.permissions;

  if (capsule.status === 'WRITING') {
    const titleLines: [string, string] =
      capsule.capsuleType === 'SELF'
        ? ['오늘의 추억을', '편지로 남겨보세요']
        : capsule.capsuleType === 'FRIEND'
          ? ['친구와의 편지가', '차근차근 모이고 있어요']
          : ['친구들의 편지가', '차근차근 모이고 있어요'];

    return {
      titleLines,
      actions: [
        { key: 'detail', label: '캡슐 정보보기', variant: 'secondary' },
        ...(canWriteLetter
          ? ([
              {
                key: 'write',
                label: '나도 편지 작성하기',
                variant: 'primary',
              },
            ] as CoverAction[])
          : []),
      ],
    };
  }

  // 잠긴 캡슐 — 개봉까지 남은 시간을 센다 (하루 미만이면 시간·분 단위)
  if (capsule.status === 'LOCKED') {
    return {
      titleLines: [
        openCountdownLabel(capsule.openAt, capsule.dDay, now),
        '타임캡슐이 열려요',
      ],
      actions: [{ key: 'detail', label: '캡슐 정보보기', variant: 'primary' }],
    };
  }

  return {
    titleLines: ['편지를 눌러', '캡슐에 담긴 추억을 확인해보세요'],
    actions: [
      { key: 'detail', label: '캡슐 정보보기', variant: 'secondary' },
      ...(canViewLetters
        ? ([
            { key: 'letters', label: '편지보기', variant: 'primary' },
          ] as CoverAction[])
        : []),
    ],
  };
};

// 어두운 배경 전용 CTA 색. 공용 Button 토큰 대신 캡슐 전용 보라를 쓴다.
const ACTION_STYLES: Record<CoverAction['variant'], string> = {
  primary: 'bg-capsule-accent text-on-primary',
  secondary: 'bg-surface text-capsule-accent',
};

/** 캡슐 상세 진입 화면. 캡슐 상태에 따라 문구와 버튼만 달라진다. */
export default function CapsuleCoverPage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: capsule, refetch } = useCapsuleDetail(capsuleId);
  // 연출 영상을 끝까지 본 직후인지. 첫 렌더 값으로 고정한다.
  const [showFlash] = useState(() =>
    Boolean((location.state as { fromOpening?: boolean } | null)?.fromOpening),
  );
  const [lettersOpen, setLettersOpen] = useState(false);
  const { data: letters } = useCapsuleLetters(capsuleId, lettersOpen);
  const [now, setNow] = useState(() => Date.now());

  // 잠긴 캡슐은 30초마다 남은 시간을 갱신하고, 개봉 시각이 지나면 다시 조회해 열린 화면으로 바꾼다
  const lockedOpenAt =
    capsule?.status === 'LOCKED' ? capsule.openAt : undefined;
  useEffect(() => {
    if (!lockedOpenAt) return;
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= serverDate(lockedOpenAt).getTime()) void refetch();
    }, 30_000);
    return () => clearInterval(timer);
  }, [lockedOpenAt, refetch]);

  // 표시를 남겨두면 새로고침할 때마다 다시 번쩍인다. 한 번 읽고 지운다.
  useEffect(() => {
    if (!showFlash) return;
    navigate('.', { replace: true, state: null });
  }, [showFlash, navigate]);

  const content = capsule ? getCoverContent(capsule, now) : null;

  const handleAction = (key: CoverActionKey) => {
    if (key === 'detail') navigate(capsuleDetailPath(capsuleId));
    if (key === 'write') navigate(letterTypePath(capsuleId));
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

      {/* 연출 영상을 끝까지 본 직후에만 흰빛을 이어받는다 */}
      {showFlash && <OpeningFlash />}
    </>
  );
}
