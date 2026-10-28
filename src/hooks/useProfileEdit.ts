import { type ChangeEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMyPageStore } from '@/stores/useMyPageStore';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 20;

export function useProfileEdit() {
  const navigate = useNavigate();
  const storedProfile = useMyPageStore((state) => state.profile);
  const updateProfile = useMyPageStore((state) => state.updateProfile);

  const [name, setName] = useState(storedProfile.name);
  const [birthday, setBirthday] = useState(storedProfile.birthday);
  const [email, setEmail] = useState(storedProfile.email);
  const [phone, setPhone] = useState(storedProfile.phone);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    storedProfile.avatarUrl,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const trimmedName = name.trim();
  const isValid =
    trimmedName.length >= MIN_NAME_LENGTH &&
    trimmedName.length <= MAX_NAME_LENGTH;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (next.length <= MAX_NAME_LENGTH) {
      setName(next);
    }
  };

  const handleBirthdayChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBirthday(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    if (!isValid) return;
    updateProfile({
      name: trimmedName,
      birthday: birthday.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatarUrl,
    });
    navigate('/mypage');
  };

  return {
    name,
    birthday,
    email,
    phone,
    avatarUrl,
    maxNameLength: MAX_NAME_LENGTH,
    isValid,
    fileInputRef,
    handleNameChange,
    handleBirthdayChange,
    handleEmailChange,
    handlePhoneChange,
    handleAvatarClick,
    handleAvatarChange,
    handleBack,
    handleSave,
  };
}
