import AvatarUpload from '@/components/common/AvatarUpload';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import BackHeader from '@/components/layout/BackHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import { useProfileSetup } from '@/hooks/useProfileSetup';
import { textStyles } from '@/styles/tokens';

export default function ProfileSetupPage() {
  const {
    nickname,
    avatarUrl,
    validation,
    isSubmitting,
    handleNicknameChange,
    handleAvatarChange,
    handleSubmit,
    handleBack,
  } = useProfileSetup();

  return (
    <MobileLayout variant="white">
      <BackHeader onBack={handleBack} showMore />

      <main className="flex flex-1 flex-col justify-between px-5 pt-[70px] pb-10">
        <div className="flex w-full flex-col gap-10">
          <div className="flex w-full flex-col gap-10">
            <div className="flex w-full flex-col gap-2">
              <h1 className={`text-text-primary ${textStyles['heading-h1']}`}>
                프로필 설정
              </h1>
              <p className={`text-text-secondary ${textStyles['body-medium']}`}>
                나중에 언제든 바꿀 수 있어요
              </p>
            </div>

            <div className="flex h-[100px] w-full items-center justify-center">
              <AvatarUpload
                avatarUrl={avatarUrl}
                onSelectFile={handleAvatarChange}
              />
            </div>
          </div>

          <Input
            label="닉네임"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임을 입력해주세요"
            helperText={validation.message}
            isError={validation.isError}
          />
        </div>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!validation.isValid || isSubmitting}
        >
          시작하기
        </Button>
      </main>
    </MobileLayout>
  );
}
