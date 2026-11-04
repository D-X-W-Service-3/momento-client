import type { ChangeEvent, RefObject } from 'react';

import CameraSolidIcon from '@/assets/icons/camera-solid.svg?react';
import defaultAvatarImg from '@/assets/images/default-avatar.png';

interface ProfileEditAvatarProps {
  avatarUrl: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onAvatarClick: () => void;
  onAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileEditAvatar({
  avatarUrl,
  fileInputRef,
  onAvatarClick,
  onAvatarChange,
}: ProfileEditAvatarProps) {
  return (
    <div className="flex h-[100px] w-full items-center justify-center">
      <button
        type="button"
        onClick={onAvatarClick}
        aria-label="프로필 이미지 변경"
        className="relative h-[100px] w-[100px] cursor-pointer"
      >
        <div className="border-border-subtle bg-surface-avatar h-[100px] w-[100px] overflow-hidden rounded-full border">
          <img
            src={avatarUrl ?? defaultAvatarImg}
            alt="프로필 이미지"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="border-border-input bg-surface-white absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border">
          <CameraSolidIcon className="h-5 w-5" />
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onAvatarChange}
        className="hidden"
      />
    </div>
  );
}
