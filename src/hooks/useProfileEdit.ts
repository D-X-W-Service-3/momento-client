import { type ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileForm } from '@/hooks/useProfileForm';
export function useProfileEdit() {
  const navigate = useNavigate();
  const form = useProfileForm(() => navigate('/mypage', { replace: true }));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return {
    name: form.values.nickname,
    birthday: form.values.birthday,
    email: form.values.email,
    phone: form.values.phoneNumber,
    avatarUrl: form.avatarUrl,
    maxNameLength: 20,
    isValid: form.isValid,
    isSaving: form.isSaving,
    isLoading: form.isLoading,
    error: form.error,
    retry: form.retry,
    validation: form.validation,
    fileInputRef,
    handleNameChange: (e: ChangeEvent<HTMLInputElement>) =>
      form.setField('nickname', e.target.value),
    handleBirthdayChange: (e: ChangeEvent<HTMLInputElement>) =>
      form.setField('birthday', e.target.value),
    handleEmailChange: (e: ChangeEvent<HTMLInputElement>) =>
      form.setField('email', e.target.value),
    handlePhoneChange: (e: ChangeEvent<HTMLInputElement>) =>
      form.setField('phoneNumber', e.target.value),
    handleAvatarClick: () => fileInputRef.current?.click(),
    handleAvatarChange: (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) form.selectPhoto(file);
      e.target.value = '';
    },
    handleBack: () => navigate(-1),
    handleSave: form.save,
  };
}
