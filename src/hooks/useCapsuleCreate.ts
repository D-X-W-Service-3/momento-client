import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { capsuleCoverPath } from '@/constants/routes';
import {
  CAPSULE_DESCRIPTION_MAX_LENGTH,
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

function getStartOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function addDays(base: Date, days: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
}

export function useCapsuleCreate() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = parseStepParam(searchParams.get('step'));

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
    inviteLink: 'www.naver.com/314564',
    editDeadline: '',
    openDate: '',
  });

  const activeSegments =
    step === 'info' ? 1 : step === 'type' ? 2 : step === 'visibility' ? 3 : 4;

  const today = getStartOfToday();
  const parsedEditDeadline = parseKoreanDate(form.editDeadline);
  const parsedOpenDate = parseKoreanDate(form.openDate);

  const minOpenDate = parsedEditDeadline
    ? addDays(parsedEditDeadline, 1)
    : addDays(today, 1);

  const datePickerMinDate = dateSheet === 'openDate' ? minOpenDate : today;

  const hasValidDates = Boolean(
    parsedEditDeadline &&
    parsedOpenDate &&
    parsedEditDeadline >= today &&
    parsedOpenDate >= addDays(parsedEditDeadline, 1),
  );

  const isNextEnabled =
    step === 'info'
      ? form.name.trim().length > 0
      : step === 'dates'
        ? hasValidDates
        : true;

  const setStep = (nextStep: CapsuleCreateStep) => {
    setSearchParams(nextStep === 'info' ? {} : { step: nextStep });
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

  const handleCopyInviteLink = () => {
    void navigator.clipboard?.writeText(form.inviteLink);
  };

  const handleShareInviteLink = () => {
    setInviteSheetOpen(false);
    if (navigator.share) {
      void navigator.share({
        title: form.name || 'Momento 타임캡슐 초대',
        url: `https://${form.inviteLink}`,
      });
      return;
    }
    void navigator.clipboard?.writeText(form.inviteLink);
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
          nextDeadline && currentOpen && currentOpen < addDays(nextDeadline, 1),
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
    if (!isNextEnabled) return;

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
      setStep('complete');
    }
  };

  const handleBack = () => {
    setDateSheet(null);
    setInviteSheetOpen(false);
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleGoCapsules = () => {
    navigate(capsuleCoverPath('1'));
  };

  return {
    step,
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
    handleCopyInviteLink,
    handleShareInviteLink,
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
