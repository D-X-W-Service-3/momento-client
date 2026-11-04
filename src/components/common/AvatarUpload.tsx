import { useRef, type ChangeEvent } from 'react';

import CameraIcon from '@/assets/icons/camera.svg?react';

interface AvatarUploadProps {
  avatarUrl: string | null;
  onSelectFile: (file: File) => void;
}

export default function AvatarUpload({
  avatarUrl,
  onSelectFile,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  return (
    <div className="relative h-[100px] w-[100px]">
      <button
        type="button"
        onClick={handleClick}
        aria-label="프로필 사진 업로드"
        className="group relative h-[100px] w-[100px] cursor-pointer"
      >
        <div className="bg-surface-subtle h-24 w-24 overflow-hidden rounded-full">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="프로필 미리보기"
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <span className="bg-surface-white border-border-default absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border transition-transform group-active:scale-95">
          <CameraIcon className="h-4 w-4" />
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
