import type { UserProfile } from '@/types/auth';

export async function updateProfile(
  profile: UserProfile,
): Promise<UserProfile> {
  return Promise.resolve(profile);
}
