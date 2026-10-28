import { type ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  CapsuleCreateForm,
  CapsuleCreateStep,
  CapsuleCreateType,
  CapsuleVisibilityType,
} from '@/types/capsule';
import { parseKoreanDate } from '@/utils/dates';

const MAX_NAME_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 45;
const TOTAL_ICONS = 5;

function getStartOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function addDays(base: Date, days: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
}

export function useCapsuleCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState<CapsuleCreateStep>('info');
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

  const handleSelectIcon = (index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_ICONS - 1, index));
    setForm((prev) => ({ ...prev, iconIndex: clamped }));
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (next.length <= MAX_NAME_LENGTH) {
      setForm((prev) => ({ ...prev, name: next }));
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    if (next.length <= MAX_DESCRIPTION_LENGTH) {
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
    if (step === 'info' || step === 'complete') {
      navigate(-1);
      return;
    }

    if (step === 'type') {
      setStep('info');
      return;
    }

    if (step === 'visibility') {
      setStep('type');
      return;
    }

    if (step === 'dates') {
      if (form.capsuleType === 'group') {
        setStep('visibility');
      } else {
        setStep('type');
      }
    }
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleGoCapsules = () => {
    navigate('/capsules');
  };

  return {
    step,
    form,
    activeSegments,
    totalSegments: 4,
    totalIcons: TOTAL_ICONS,
    maxNameLength: MAX_NAME_LENGTH,
    maxDescriptionLength: MAX_DESCRIPTION_LENGTH,
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
