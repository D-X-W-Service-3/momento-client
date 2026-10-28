import defaultAvatarImg from '@/assets/images/default-avatar.png';
import { textStyles } from '@/styles/tokens';
import type { MyPageProfile } from '@/types/mypage';

interface ProfileSummaryCardProps {
  profile: MyPageProfile;
  onEditProfile: () => void;
}

export default function ProfileSummaryCard({
  profile,
  onEditProfile,
}: ProfileSummaryCardProps) {
  return (
    <section className="bg-surface-white flex w-full flex-col gap-4 rounded-lg p-4">
      <div className="flex w-full items-center gap-3">
        <div className="border-border-subtle bg-surface-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-full border">
          <img
            src={profile.avatarUrl ?? defaultAvatarImg}
            alt={`${profile.name} 프로필`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-[6px]">
          <strong className={`text-text-dark ${textStyles['profile-name']}`}>
            {profile.name}
          </strong>
          <span className={`text-text-meta ${textStyles['caption-tight']}`}>
            쓴 편지 {profile.writtenLetterCount}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onEditProfile}
        className="bg-surface-muted flex h-9 w-full cursor-pointer items-center justify-center rounded-md px-4"
      >
        <span
          className={`text-text-button-sub ${textStyles['sub-button-label']}`}
        >
          프로필 정보 수정
        </span>
      </button>
    </section>
  );
}
