import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCapsule } from '@/apis/capsules';
import { invalidateCapsuleQueries } from '@/utils/queryInvalidation';

import { capsuleCoverPath } from '@/constants/routes';
import {
  CAPSULE_DESCRIPTION_MAX_LENGTH,
  CAPSULE_DESCRIPTION_MIN_LENGTH,
  CAPSULE_NAME_MAX_LENGTH,
  type CapsuleCreateForm,
  type CapsuleCreateStep,
  type CapsuleCreateType,
  type CapsuleVisibilityType,
} from '@/types/capsule';
import { parseKoreanDate } from '@/utils/dates';

const TOTAL_ICONS = 5;

const VALID_STEPS: readonly CapsuleCreateStep[] = [
  'info',
  'type',
  'visibility',
  'dates',
  'complete',
];

function parseStepParam(value: string | null): CapsuleCreateStep {
  if (value && VALID_STEPS.includes(value as CapsuleCreateStep)) {
    return value as CapsuleCreateStep;
  }
  return 'info';
}

/** 생성 플로우 진입(info) 이후 쌓인 히스토리 항목 수. 단계 push 시 state 로 넘긴다. */
function getFlowDepth(state: unknown): number {
  if (state && typeof state === 'object' && 'depth' in state) {
    const { depth } = state as { depth: unknown };
    if (typeof depth === 'number') return depth;
  }
  return 0;
}

/** BrowserRouter 가 history.state.idx 에 기록하는 앱 내 히스토리 위치 */
function canGoBackInApp(): boolean {
  const state = window.history.state as { idx?: number } | null;
  return (state?.idx ?? 0) > 0;
}

const CAPSULE_HOME_PATH = '/capsules';

/**
 * editing   : 단계 입력 중
 * finishing : 완료 처리 중 (플로우 히스토리를 진입 지점까지 되감는 중)
 * completed : 완료 화면 (생성 단계로 다시 돌아갈 수 없음)
 */
type CreatePhase = 'editing' | 'finishing' | 'completed';

function getStartOfToday(): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const part = (type: string) =>
    Number(parts.find((entry) => entry.type === type)?.value);
  return new Date(part('year'), part('month') - 1, part('day'));
}

const dateOnly = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function addDays(base: Date, days: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
}

export function useCapsuleCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createdCapsuleId, setCreatedCapsuleId] = useState('');
  const submitting = useRef(false);
  const creation = useMutation({
    mutationFn: createCapsule,
    retry: false,
    onError: () => {
      submitting.current = false;
    },
  });
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStep = parseStepParam(searchParams.get('step'));
  const flowDepth = getFlowDepth(location.state);

  const [phase, setPhase] = useState<CreatePhase>('editing');
  // 되감기·앞으로가기 차단 중에도 생성 단계가 깜빡이지 않도록 완료 화면을 유지한다.
  const step: CapsuleCreateStep = phase === 'editing' ? urlStep : 'complete';

  const [dateSheet, setDateSheet] = useState<
    'editDeadline' | 'openDate' | null
  >(null);
  const [inviteSheetOpen, setInviteSheetOpen] = useState(false);
  const [form, setForm] = useState<CapsuleCreateForm>({
    iconIndex: 0,
    name: '',
    description: '',
    capsuleType: 'solo',
    visibility: 'all_participants',
    editDeadline: '',
    openDate: '',
  });

  const activeSegments =
    step === 'info' ? 1 : step === 'type' ? 2 : step === 'visibility' ? 3 : 4;

  const today = getStartOfToday();
  const parsedEditDeadline = parseKoreanDate(form.editDeadline);
  const parsedOpenDate = parseKoreanDate(form.openDate);

  const minOpenDate = parsedEditDeadline
    ? addDays(parsedEditDeadline, 2)
    : addDays(today, 2);

  const datePickerMinDate = dateSheet === 'openDate' ? minOpenDate : today;

  const hasValidDates = Boolean(
    parsedEditDeadline &&
    parsedOpenDate &&
    parsedEditDeadline >= today &&
    parsedOpenDate >= addDays(parsedEditDeadline, 2),
  );

  const hasValidInfo =
    form.name.trim().length > 0 &&
    form.name.trim().length <= CAPSULE_NAME_MAX_LENGTH &&
    form.description.trim().length >= CAPSULE_DESCRIPTION_MIN_LENGTH &&
    form.description.length <= CAPSULE_DESCRIPTION_MAX_LENGTH;
  const isNextEnabled = hasValidInfo && (step !== 'dates' || hasValidDates);

  const setStep = (nextStep: CapsuleCreateStep) => {
    setSearchParams(nextStep === 'info' ? {} : { step: nextStep }, {
      state: { depth: flowDepth + 1 },
    });
  };

  useEffect(() => {
    if (phase === 'finishing') {
      // navigate(-depth) 로 진입 지점(info)에 도착하면 그 항목을 완료 화면으로 교체한다.
      // → 히스토리: [진입 전 페이지, /capsules/new?step=complete]
      if (urlStep !== 'info') return;
      setSearchParams({ step: 'complete' }, { replace: true });
      setPhase('completed');
      return;
    }

    if (phase === 'completed') {
      // 되감은 뒤에도 forward 스택에 생성 단계가 남아 있으므로,
      // 앞으로가기로 들어오면 완료 화면으로 되돌린다.
      if (urlStep !== 'complete' && urlStep !== 'info') navigate(-1);
      return;
    }

    // 완료하지 않은 상태로 완료 URL 에 들어온 경우 (새로고침·직접 진입)
    if (urlStep === 'complete') {
      navigate(CAPSULE_HOME_PATH, { replace: true });
      return;
    }

    // 입력값 없이 중간 단계에 들어온 경우 (새로고침·직접 진입) 첫 단계로 보낸다.
    if (urlStep !== 'info' && !hasValidInfo) {
      setSearchParams({}, { replace: true });
    }
  }, [phase, urlStep, hasValidInfo, navigate, setSearchParams]);

  const finishCreate = () => {
    setDateSheet(null);
    if (flowDepth > 0) {
      setPhase('finishing');
      navigate(-flowDepth);
      return;
    }
    setSearchParams({ step: 'complete' }, { replace: true });
    setPhase('completed');
  };

  const handleSelectIcon = (index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_ICONS - 1, index));
    setForm((prev) => ({ ...prev, iconIndex: clamped }));
  };

  const handleNameChange = (next: string) => {
    if (next.length <= CAPSULE_NAME_MAX_LENGTH) {
      setForm((prev) => ({ ...prev, name: next }));
    }
  };

  const handleDescriptionChange = (next: string) => {
    if (next.length <= CAPSULE_DESCRIPTION_MAX_LENGTH) {
      setForm((prev) => ({ ...prev, description: next }));
    }
  };

  const handleSelectCapsuleType = (capsuleType: CapsuleCreateType) => {
    setForm((prev) => ({ ...prev, capsuleType }));
  };

  const handleSelectVisibility = (visibility: CapsuleVisibilityType) => {
    setForm((prev) => ({ ...prev, visibility }));
  };

  const handleOpenDateSheet = (target: 'editDeadline' | 'openDate') => {
    setDateSheet(target);
  };

  const handleCloseDateSheet = () => {
    setDateSheet(null);
  };

  const handleSelectDate = (selectedDate: string) => {
    if (!dateSheet) return;

    if (dateSheet === 'editDeadline') {
      const nextDeadline = parseKoreanDate(selectedDate);
      setForm((prev) => {
        const currentOpen = parseKoreanDate(prev.openDate);
        const shouldResetOpenDate = Boolean(
          nextDeadline && currentOpen && currentOpen < addDays(nextDeadline, 2),
        );
        return {
          ...prev,
          editDeadline: selectedDate,
          openDate: shouldResetOpenDate ? '' : prev.openDate,
        };
      });
    } else {
      setForm((prev) => ({
        ...prev,
        openDate: selectedDate,
      }));
    }

    setDateSheet(null);
  };

  const handleOpenInviteSheet = () => {
    setInviteSheetOpen(true);
  };

  const handleCloseInviteSheet = () => {
    setInviteSheetOpen(false);
  };

  const handleNext = () => {
    if (
      !isNextEnabled ||
      submitting.current ||
      creation.isPending ||
      createdCapsuleId
    )
      return;

    if (step === 'info') {
      setStep('type');
      return;
    }

    if (step === 'type') {
      if (form.capsuleType === 'group') {
        setStep('visibility');
      } else {
        setStep('dates');
      }
      return;
    }

    if (step === 'visibility') {
      setStep('dates');
      return;
    }

    if (step === 'dates') {
      if (!parsedEditDeadline || !parsedOpenDate) return;
      submitting.current = true;
      creation.mutate(
        {
          iconType: 'ICE_CREAM',
          title: form.name.trim(),
          description: form.description.trim(),
          capsuleType:
            form.capsuleType === 'solo'
              ? 'SELF'
              : form.capsuleType === 'friend'
                ? 'FRIEND'
                : 'GROUP',
          visibilityType:
            form.capsuleType !== 'group' ||
            form.visibility === 'all_participants'
              ? 'ALL_MEMBERS'
              : 'RECIPIENT_AND_AUTHOR',
          letterDeadlineDate: dateOnly(parsedEditDeadline),
          openDate: dateOnly(parsedOpenDate),
        },
        {
          onSuccess: (result) => {
            setCreatedCapsuleId(String(result.capsuleId));
            void invalidateCapsuleQueries(queryClient);
            finishCreate();
          },
        },
      );
    }
  };

  const handleBack = () => {
    if (creation.isPending) return;
    setDateSheet(null);
    setInviteSheetOpen(false);
    // 완료 화면에서도 진입 전 페이지로 돌아간다 (생성 단계는 이미 되감겨 있음).
    // 앱 첫 화면으로 직접 들어와 돌아갈 곳이 없으면 캡슐 홈으로 보낸다.
    if (!canGoBackInApp()) {
      navigate(CAPSULE_HOME_PATH, { replace: true });
      return;
    }
    navigate(-1);
  };

  // 완료 화면을 히스토리에 남기지 않도록 replace 로 이동한다.
  // → 이동한 화면에서 뒤로가기 시 진입 전 페이지로 돌아간다.
  const handleGoHome = () => {
    navigate('/home', { replace: true });
  };

  const handleGoCapsules = () => {
    if (createdCapsuleId)
      navigate(capsuleCoverPath(createdCapsuleId), { replace: true });
  };

  return {
    step,
    createdCapsuleId,
    isCreating: creation.isPending,
    error: creation.error,
    form,
    activeSegments,
    totalSegments: 4,
    totalIcons: TOTAL_ICONS,
    maxNameLength: CAPSULE_NAME_MAX_LENGTH,
    maxDescriptionLength: CAPSULE_DESCRIPTION_MAX_LENGTH,
    isNextEnabled,
    dateSheet,
    datePickerMinDate,
    inviteSheetOpen,
    handleSelectIcon,
    handleNameChange,
    handleDescriptionChange,
    handleSelectCapsuleType,
    handleSelectVisibility,
    handleOpenDateSheet,
    handleCloseDateSheet,
    handleSelectDate,
    handleOpenInviteSheet,
    handleCloseInviteSheet,
    handleNext,
    handleBack,
    handleGoHome,
    handleGoCapsules,
  };
}
