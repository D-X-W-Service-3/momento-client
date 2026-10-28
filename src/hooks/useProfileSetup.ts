import { useState, type ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { updateProfile } from '@/apis/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { validateNickname } from '@/utils/validation';

export function useProfileSetup() {
  const navigate = useNavigate();
  const storedProfile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);

  const [nickname, setNickname] = useState(storedProfile.nickname);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    storedProfile.avatarUrl,
  );

  const validation = validateNickname(nickname);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      setProfile(updated);
    },
  });

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleAvatarChange = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);
  };

  const handleSubmit = () => {
    if (!validation.isValid) return;
    mutation.mutate({
      nickname: nickname.trim(),
      avatarUrl,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return {
    nickname,
    avatarUrl,
    validation,
    isSubmitting: mutation.isPending,
    handleNicknameChange,
    handleAvatarChange,
    handleSubmit,
    handleBack,
  };
}
