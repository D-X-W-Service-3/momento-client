import BottomSheet from '@/components/common/BottomSheet';
import DatePicker from '@/components/common/DatePicker';
import CapsuleCompleteStep from '@/components/capsule/create/CapsuleCompleteStep';
import CapsuleDateStep from '@/components/capsule/create/CapsuleDateStep';
import CapsuleInfoStep from '@/components/capsule/create/CapsuleInfoStep';
import CapsuleInviteStep from '@/components/capsule/create/CapsuleInviteStep';
import CapsuleStepProgress from '@/components/capsule/create/CapsuleStepProgress';
import CapsuleTypeStep from '@/components/capsule/create/CapsuleTypeStep';
import CapsuleVisibilityStep from '@/components/capsule/create/CapsuleVisibilityStep';
import BackHeader from '@/components/layout/BackHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import { useCapsuleCreate } from '@/hooks/useCapsuleCreate';
import { textStyles } from '@/styles/tokens';

export default function CapsuleCreatePage() {
  const {
    step,
    form,
    activeSegments,
    totalSegments,
    totalIcons,
    maxNameLength,
    maxDescriptionLength,
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
  } = useCapsuleCreate();

  if (step === 'complete') {
    return (
      <MobileLayout variant="gray">
        <BackHeader title="" onBack={handleBack} className="bg-surface-gray" />
        <CapsuleCompleteStep
          isSolo={form.capsuleType === 'solo'}
          onGoHome={handleGoHome}
          onOpenInviteSheet={handleOpenInviteSheet}
          onGoCapsules={handleGoCapsules}
        />

        <BottomSheet open={inviteSheetOpen} onClose={handleCloseInviteSheet}>
          <CapsuleInviteStep
            inviteLink={form.inviteLink}
            onCopyLink={handleCopyInviteLink}
            onShareLink={handleShareInviteLink}
          />
        </BottomSheet>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout variant="gray">
      <BackHeader
        title="캡슐 만들기"
        onBack={handleBack}
        className="bg-surface-gray"
      />

      <main className="flex flex-1 flex-col justify-between gap-5 px-5 pt-2 pb-5">
        <div className="flex w-full flex-col gap-5">
          <CapsuleStepProgress
            activeSegments={activeSegments}
            totalSegments={totalSegments}
          />

          {step === 'info' && (
            <CapsuleInfoStep
              iconIndex={form.iconIndex}
              totalIcons={totalIcons}
              name={form.name}
              description={form.description}
              maxNameLength={maxNameLength}
              maxDescriptionLength={maxDescriptionLength}
              onSelectIcon={handleSelectIcon}
              onNameChange={handleNameChange}
              onDescriptionChange={handleDescriptionChange}
            />
          )}

          {step === 'type' && (
            <CapsuleTypeStep
              selected={form.capsuleType}
              onSelect={handleSelectCapsuleType}
            />
          )}

          {step === 'visibility' && (
            <CapsuleVisibilityStep
              selected={form.visibility}
              onSelect={handleSelectVisibility}
            />
          )}

          {step === 'dates' && (
            <CapsuleDateStep
              editDeadline={form.editDeadline}
              openDate={form.openDate}
              onOpenDatePicker={handleOpenDateSheet}
            />
          )}
        </div>

        <button
          type="button"
          disabled={!isNextEnabled}
          onClick={handleNext}
          className={`flex h-[52px] w-full items-center justify-center rounded-lg px-5 transition-colors ${
            isNextEnabled
              ? 'bg-primary text-text-on-primary cursor-pointer'
              : 'bg-border-input text-text-hint cursor-not-allowed'
          } ${textStyles['button-label']}`}
        >
          다음
        </button>
      </main>

      <BottomSheet open={dateSheet !== null} onClose={handleCloseDateSheet}>
        <DatePicker
          value={
            dateSheet === 'editDeadline' ? form.editDeadline : form.openDate
          }
          minDate={datePickerMinDate}
          onCancel={handleCloseDateSheet}
          onSelect={handleSelectDate}
        />
      </BottomSheet>
    </MobileLayout>
  );
}
