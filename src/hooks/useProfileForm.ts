import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchMyProfile,
  updateMyProfile,
  uploadProfileImage,
  type MyProfileResponse,
  type ProfileUpdateRequest,
} from '@/apis/mypage';
import { ApiError } from '@/apis/client';
import { useNicknameValidation } from '@/hooks/useNicknameValidation';
import { useAuthStore } from '@/stores/useAuthStore';
import { validateMemoryImages } from '@/utils/archivePhotos';

type Draft = {
  nickname: string;
  birthday: string;
  email: string;
  phoneNumber: string;
};
export function useProfileForm(onSaved: () => void, onboarding = false) {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['myProfile'], queryFn: fetchMyProfile });
  const [draft, setDraft] = useState<Partial<Draft>>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<Error | null>(null);
  const uploaded = useRef<{ file: File; key: string } | null>(null);
  const saving = useRef(false);
  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  const values: Draft = {
    nickname: draft.nickname ?? query.data?.nickname ?? '',
    birthday: draft.birthday ?? query.data?.birthday ?? '',
    email: draft.email ?? query.data?.email ?? '',
    phoneNumber: draft.phoneNumber ?? query.data?.phoneNumber ?? '',
  };
  const validation = useNicknameValidation(
    values.nickname,
    query.data?.nickname,
  );
  const mutation = useMutation({
    mutationFn: async ({
      fields,
      file,
    }: {
      fields: ProfileUpdateRequest;
      file: File | null;
    }) => {
      if (file) {
        if (uploaded.current?.file !== file)
          uploaded.current = { file, key: await uploadProfileImage(file) };
        fields.profileImageKey = uploaded.current.key;
      }
      return updateMyProfile(fields);
    },
    retry: false,
    onSuccess: (data: MyProfileResponse) => {
      queryClient.setQueryData(['myProfile'], data);
      const auth = useAuthStore.getState();
      auth.setProfile({
        nickname: data.nickname,
        avatarUrl: data.profileImageUrl,
      });
      if (onboarding) useAuthStore.getState().completeOnboarding();
      void queryClient.invalidateQueries({ queryKey: ['homeDashboard'] });
      void queryClient.invalidateQueries({
        queryKey: ['nicknameAvailability'],
      });
      onSaved();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.code === 'NICKNAME_DUPLICATED') {
        queryClient.setQueryData(
          ['nicknameAvailability', values.nickname.trim()],
          { nickname: values.nickname.trim(), available: false },
        );
      }
    },
    onSettled: () => {
      saving.current = false;
    },
  });
  const phone = values.phoneNumber
    .trim()
    .replace(/^(010)(\d{4})(\d{4})$/, '$1-$2-$3');
  const fieldError =
    !onboarding &&
    values.email.trim() &&
    (values.email.trim().length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      ? '이메일 형식을 확인해 주세요.'
      : !onboarding && phone && !/^010-\d{4}-\d{4}$/.test(phone)
        ? '전화번호는 010-0000-0000 형식으로 입력해 주세요.'
        : !onboarding && query.data?.birthday && !values.birthday
          ? '등록한 생일은 비울 수 없어요.'
          : null;
  const isValid =
    Boolean(query.data) &&
    validation.isValid &&
    !fieldError &&
    !mutation.isPending;
  const setField = (field: keyof Draft, value: string) => {
    if (saving.current) return;
    setDraft((previous) => ({ ...previous, [field]: value }));
    mutation.reset();
  };
  const selectPhoto = (file: File) => {
    if (saving.current) return;
    try {
      validateMemoryImages([file]);
      setPhoto(file);
      setFileError(null);
      mutation.reset();
    } catch (error) {
      setFileError(
        error instanceof Error ? error : new Error('사진을 선택할 수 없어요.'),
      );
    }
  };
  const save = () => {
    if (!isValid || saving.current) return;
    const fields: ProfileUpdateRequest = { nickname: values.nickname.trim() };
    if (!onboarding) {
      if (values.birthday) fields.birthday = values.birthday;
      fields.email = values.email.trim();
      fields.phoneNumber = phone;
    }
    saving.current = true;
    mutation.mutate({ fields, file: photo });
  };
  return {
    values,
    validation,
    avatarUrl: preview ?? query.data?.profileImageUrl ?? null,
    setField,
    selectPhoto,
    save,
    isValid,
    isSaving: mutation.isPending,
    isLoading: query.isLoading,
    retry: query.refetch,
    error:
      fileError ??
      mutation.error ??
      query.error ??
      (fieldError ? new Error(fieldError) : null),
  };
}
