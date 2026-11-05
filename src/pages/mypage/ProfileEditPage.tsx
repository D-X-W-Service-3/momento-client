import BackHeader from '@/components/layout/BackHeader';
import QueryFeedback from '@/components/common/QueryFeedback';
import MobileLayout from '@/components/layout/MobileLayout';
import ProfileEditAvatar from '@/components/mypage/ProfileEditAvatar';
import ProfileEditField from '@/components/mypage/ProfileEditField';
import { useProfileEdit } from '@/hooks/useProfileEdit';
import { textStyles } from '@/styles/tokens';

export default function ProfileEditPage() {
  const {
    name,
    birthday,
    email,
    phone,
    avatarUrl,
    maxNameLength,
    isValid,
    isSaving,
    isLoading,
    error,
    retry,
    validation,
    fileInputRef,
    handleNameChange,
    handleBirthdayChange,
    handleEmailChange,
    handlePhoneChange,
    handleAvatarClick,
    handleAvatarChange,
    handleBack,
    handleSave,
  } = useProfileEdit();

  return (
    <MobileLayout variant="white">
      <BackHeader
        title="프로필 정보 수정"
        onBack={handleBack}
        className="bg-surface-white"
      />

      <main className="flex flex-1 flex-col gap-3 p-5">
        <QueryFeedback loading={isLoading} error={error} onRetry={retry} />
        <fieldset disabled={isSaving || isLoading} className="contents">
          <ProfileEditAvatar
            avatarUrl={avatarUrl}
            fileInputRef={fileInputRef}
            onAvatarClick={handleAvatarClick}
            onAvatarChange={handleAvatarChange}
          />

          <div className="flex w-full flex-col gap-2">
            <ProfileEditField
              id="profile-name"
              label="이름"
              value={name}
              onChange={handleNameChange}
              maxLength={maxNameLength}
              helperText={validation.message || '2~20자 이내'}
              wrapperClassName="py-[10px]"
            />

            <ProfileEditField
              id="profile-birthday"
              label="생일"
              type="date"
              value={birthday}
              onChange={handleBirthdayChange}
              wrapperClassName="py-[10px]"
            />
          </div>

          <section className="flex w-full flex-col gap-3">
            <h2 className={`text-text-dark ${textStyles['section-title']}`}>
              계정 정보
            </h2>

            <ProfileEditField
              id="profile-email"
              label="이메일"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />

            <ProfileEditField
              id="profile-phone"
              label="전화번호"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
            />
          </section>
        </fieldset>
      </main>

      {/* 하단 고정: 내용이 길어도 저장 버튼이 항상 보이게 */}
      <div className="bg-surface-white sticky bottom-0 z-20 px-5 pt-[10px] pb-[max(20px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid}
          className={`flex h-14 w-full items-center justify-center rounded-lg px-5 py-4 transition-opacity ${
            isValid
              ? 'bg-primary text-text-on-primary cursor-pointer'
              : 'bg-primary text-text-on-primary cursor-not-allowed opacity-50'
          }`}
        >
          <span className="text-body-lg leading-4 font-semibold tracking-[-0.32px]">
            {isSaving ? '저장 중…' : '저장하기'}
          </span>
        </button>
      </div>
    </MobileLayout>
  );
}
