import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCapsule } from '@/apis/capsules';
import { invalidateCapsuleQueries } from '@/utils/queryInvalidation';

import { capsuleCoverPath } from '@/constants/routes';
import {
  CAPSULE_ICONS,
  DEFAULT_CAPSULE_ICON_TYPE,
} from '@/constants/capsuleIcons';
import {
  CAPSULE_DESCRIPTION_MAX_LENGTH,
  CAPSULE_DESCRIPTION_MIN_LENGTH,
  CAPSULE_NAME_MAX_LENGTH,
  type CapsuleCreateForm,
  type CapsuleCreateStep,
  type CapsuleCreateType,
  type CapsuleVisibilityType,
} from '@/types/capsule';
import {
  combineKoreanDateTime,
  formatKoreanTime,
  toLocalDateTime,
} from '@/utils/dates';

const TOTAL_ICONS = CAPSULE_ICONS.length;

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

/** 한국 시간 기준 현재 시각을 로컬 Date 로 (서버가 KST LocalDateTime 으로 받는다) */
function getNowInSeoul(): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const part = (type: string) =>
    Number(parts.find((entry) => entry.type === type)?.value);
  return new Date(
    part('year'),
    part('month') - 1,
    part('day'),
    part('hour'),
    part('minute'),
  );
}

/** 서버 규칙: 개봉은 마감보다 1시간 이상 뒤 (정확히 1시간 허용) */
const MIN_OPEN_GAP_MS = 60 * 60 * 1000;

type ScheduleTarget = 'editDeadline' | 'openDate';
type ScheduleSheet = { target: ScheduleTarget; stage: 'date' | 'time' };

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

  // 마감·개봉 각각 날짜 → 시간 순서로 고른다. 시간을 고르는 동안 날짜는 pendingDate 에 둔다.
  const [scheduleSheet, setScheduleSheet] = useState<ScheduleSheet | null>(
    null,
  );
  const [pendingDate, setPendingDate] = useState('');
  const [inviteSheetOpen, setInviteSheetOpen] = useState(false);
  const [hasEditedName, setHasEditedName] = useState(false);
  const [form, setForm] = useState<CapsuleCreateForm>({
    iconIndex: 0,
    name: '',
    description: '',
    capsuleType: 'solo',
    visibility: 'all_participants',
    editDeadline: '',
    editDeadlineTime: '',
    openDate: '',
    openTime: '',
  });

  const activeSegments =
    step === 'info' ? 1 : step === 'type' ? 2 : step === 'visibility' ? 3 : 4;

  const now = getNowInSeoul();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineAt = combineKoreanDateTime(
    form.editDeadline,
    form.editDeadlineTime,
  );
  const openAt = combineKoreanDateTime(form.openDate, form.openTime);

  // 개봉 날짜는 마감 날짜부터 고를 수 있다 (같은 날 1시간 뒤 개봉 가능)
  const datePickerMinDate =
    scheduleSheet?.target === 'openDate' && deadlineAt
      ? new Date(
          deadlineAt.getFullYear(),
          deadlineAt.getMonth(),
          deadlineAt.getDate(),
        )
      : today;

  const isOpenAfterDeadline = (open: Date, deadline: Date) =>
    open.getTime() - deadline.getTime() >= MIN_OPEN_GAP_MS;

  const hasValidDates = Boolean(
    deadlineAt &&
    openAt &&
    deadlineAt > now &&
    isOpenAfterDeadline(openAt, deadlineAt),
  );

  /** 시간 휠에서 고른 값이 규칙에 맞지 않으면 안내 문구를 돌려준다 */
  const validateTime = (time: string) => {
    if (!scheduleSheet) return undefined;
    const selected = combineKoreanDateTime(pendingDate, time);
    if (!selected) return undefined;
    const current = getNowInSeoul();
    if (selected <= current) return '지금보다 이후 시간으로 골라주세요';
    if (
      scheduleSheet.target === 'openDate' &&
      deadlineAt &&
      !isOpenAfterDeadline(selected, deadlineAt)
    ) {
      return '개봉은 편지 수정 마감 1시간 뒤부터 가능해요';
    }
    return undefined;
  };

  /** 시간 휠의 처음 값: 고른 적 있으면 그 값, 개봉은 마감 1시간 뒤, 그 외 오후 12:00 */
  const timePickerInitial = (() => {
    if (!scheduleSheet) return '';
    if (scheduleSheet.target === 'editDeadline') {
      return form.editDeadlineTime || '오후 12:00';
    }
    if (form.openTime) return form.openTime;
    if (deadlineAt) {
      const next = new Date(deadlineAt.getTime() + MIN_OPEN_GAP_MS);
      return formatKoreanTime(next.getHours(), next.getMinutes());
    }
    return '오후 12:00';
  })();

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
    setScheduleSheet(null);
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
      if (next.length > 0) setHasEditedName(true);
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

  const handleOpenDateSheet = (target: ScheduleTarget) => {
    setPendingDate('');
    setScheduleSheet({ target, stage: 'date' });
  };

  const handleCloseDateSheet = () => {
    setScheduleSheet(null);
  };

  /** 날짜를 고르면 같은 시트에서 시간 선택으로 넘어간다 */
  const handleSelectDate = (selectedDate: string) => {
    if (!scheduleSheet) return;
    setPendingDate(selectedDate);
    setScheduleSheet({ target: scheduleSheet.target, stage: 'time' });
  };

  const handleSelectTime = (selectedTime: string) => {
    if (!scheduleSheet || !pendingDate) return;

    if (scheduleSheet.target === 'editDeadline') {
      const nextDeadline = combineKoreanDateTime(pendingDate, selectedTime);
      setForm((prev) => {
        const currentOpen = combineKoreanDateTime(prev.openDate, prev.openTime);
        // 마감이 바뀌어 개봉이 규칙을 어기게 되면 개봉을 다시 고르게 한다
        const shouldResetOpen = Boolean(
          nextDeadline &&
          currentOpen &&
          !isOpenAfterDeadline(currentOpen, nextDeadline),
        );
        return {
          ...prev,
          editDeadline: pendingDate,
          editDeadlineTime: selectedTime,
          openDate: shouldResetOpen ? '' : prev.openDate,
          openTime: shouldResetOpen ? '' : prev.openTime,
        };
      });
    } else {
      setForm((prev) => ({
        ...prev,
        openDate: pendingDate,
        openTime: selectedTime,
      }));
    }

    setScheduleSheet(null);
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
      if (!deadlineAt || !openAt) return;
      submitting.current = true;
      creation.mutate(
        {
          iconType:
            CAPSULE_ICONS[form.iconIndex]?.id ?? DEFAULT_CAPSULE_ICON_TYPE,
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
          letterDeadlineAt: toLocalDateTime(deadlineAt),
          openAt: toLocalDateTime(openAt),
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
    setScheduleSheet(null);
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
    nameError:
      hasEditedName && !form.name.trim()
        ? '캡슐 이름을 입력해주세요.'
        : undefined,
    activeSegments,
    totalSegments: 4,
    totalIcons: TOTAL_ICONS,
    maxNameLength: CAPSULE_NAME_MAX_LENGTH,
    maxDescriptionLength: CAPSULE_DESCRIPTION_MAX_LENGTH,
    isNextEnabled,
    scheduleSheet,
    pendingDate,
    datePickerMinDate,
    timePickerInitial,
    validateTime,
    inviteSheetOpen,
    handleSelectIcon,
    handleNameChange,
    handleDescriptionChange,
    handleSelectCapsuleType,
    handleSelectVisibility,
    handleOpenDateSheet,
    handleCloseDateSheet,
    handleSelectDate,
    handleSelectTime,
    handleOpenInviteSheet,
    handleCloseInviteSheet,
    handleNext,
    handleBack,
    handleGoHome,
    handleGoCapsules,
  };
}
