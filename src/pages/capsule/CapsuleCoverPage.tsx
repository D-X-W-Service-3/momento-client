import { useEffect, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import Button from '@/components/common/Button';
import QueryFeedback from '@/components/common/QueryFeedback';
import CapsuleCoverLayout from '@/components/capsule/CapsuleCoverLayout';
import LetterViewer from '@/components/capsule/LetterViewer';
import OpeningFlash from '@/components/capsule/OpeningFlash';
import {
  capsuleDetailPath,
  capsuleRevealPath,
  letterTypePath,
} from '@/constants/routes';
import { useCapsuleDetail } from '@/hooks/useCapsule';
import { useCapsuleLetters } from '@/hooks/useLetter';
import type {
  CapsuleCoverNavigationState,
  CapsuleDetail,
} from '@/types/capsule';
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
 * 편지 열람 버튼은 권한과 실제 열람 가능한 편지 목록을 확인해 노출한다.
 */
const getCoverContent = (
  capsule: CapsuleDetail,
  now: number,
  hasViewableLetters: boolean,
): CoverContent => {
  const { canWriteLetter } = capsule.permissions;

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
    titleLines: [
      hasViewableLetters ? '편지를 눌러' : '타임캡슐이 열렸어요',
      '캡슐에 담긴 추억을 확인해보세요',
    ],
    actions: [
      { key: 'detail', label: '캡슐 정보보기', variant: 'secondary' },
      ...(hasViewableLetters
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
  const {
    data: capsule,
    error,
    isFetching,
    refetch,
  } = useCapsuleDetail(capsuleId);
  const openingState = location.state as CapsuleCoverNavigationState | null;
  const showOpeningFlash = openingState?.showOpeningFlash;
  const [flashCapsuleId, setFlashCapsuleId] = useState(() =>
    showOpeningFlash ? capsuleId : null,
  );
  const [lettersOpen, setLettersOpen] = useState(false);
  const needsReveal =
    capsule?.status === 'OPENED' &&
    !capsule.openedByMe &&
    !openingState?.openingFinished &&
    !error;
  const canViewLetters =
    capsule?.status === 'OPENED' &&
    capsule.permissions.canViewLetters &&
    !needsReveal;
  const {
    data: letters,
    error: lettersError,
    refetch: refetchLetters,
  } = useCapsuleLetters(capsuleId, canViewLetters);
  const hasViewableLetters = canViewLetters && Boolean(letters?.length);
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

  // 새로고침 시 플래시는 반복하지 않는다. 이 방문의 개봉 시도 표시는 유지한다.
  useEffect(() => {
    if (!showOpeningFlash) return;
    navigate('.', {
      replace: true,
      state: { openingFinished: true } satisfies CapsuleCoverNavigationState,
    });
  }, [showOpeningFlash, navigate]);

  // 개봉 요청이 실패해도 연출 직후에는 커버를 보여 준다. 새로 진입하면 다시 확인한다.
  if (needsReveal) {
    return isFetching ? null : (
      <Navigate to={capsuleRevealPath(capsuleId)} replace />
    );
  }

  const content = capsule
    ? getCoverContent(capsule, now, hasViewableLetters)
    : null;

  const handleAction = (key: CoverActionKey) => {
    if (key === 'detail') navigate(capsuleDetailPath(capsuleId));
    if (key === 'write') navigate(letterTypePath(capsuleId));
    if (key === 'letters') setLettersOpen(true);
  };

  return (
    <>
      {content && (
        <CapsuleCoverLayout titleLines={content.titleLines}>
          {canViewLetters && !hasViewableLetters && lettersError && (
            <div className="rounded-xl bg-surface">
              <QueryFeedback error={lettersError} onRetry={refetchLetters} />
            </div>
          )}
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
      {!content && error && <QueryFeedback error={error} onRetry={refetch} />}

      <LetterViewer
        open={lettersOpen && hasViewableLetters}
        letters={letters ?? []}
        onClose={() => setLettersOpen(false)}
      />

      {/* 연출 영상을 끝까지 본 직후에만 흰빛을 이어받는다 */}
      {flashCapsuleId === capsuleId && openingState?.openingFinished && (
        <OpeningFlash
          ready={Boolean(content || error)}
          onFinished={() => setFlashCapsuleId(null)}
        />
      )}
    </>
  );
}
