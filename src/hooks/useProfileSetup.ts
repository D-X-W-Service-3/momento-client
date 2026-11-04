import { useNavigate } from 'react-router-dom';
import { useProfileForm } from '@/hooks/useProfileForm';
import { takeRedirect } from '@/utils/auth';

export function useProfileSetup() {
  const navigate = useNavigate();
  const form = useProfileForm(() => {
    const target = takeRedirect();
    const path = target?.split('?')[0];
    navigate(
      path === '/profile-setup' || path === '/onboarding'
        ? '/home'
        : (target ?? '/home'),
      { replace: true },
    );
  }, true);
  return {
    nickname: form.values.nickname,
    avatarUrl: form.avatarUrl,
    validation: { ...form.validation, isValid: form.isValid },
    isSubmitting: form.isSaving,
    isLoading: form.isLoading,
    error: form.error,
    retry: form.retry,
    handleNicknameChange: (value: string) => form.setField('nickname', value),
    handleAvatarChange: form.selectPhoto,
    handleSubmit: form.save,
    handleBack: () => navigate(-1),
  };
}
