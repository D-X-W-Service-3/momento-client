import { create } from 'zustand';

import type { UserProfile } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  profile: UserProfile;
  loginWithKakao: () => void;
  logout: () => void;
  completeOnboarding: () => void;
  setProfile: (profile: UserProfile) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  profile: {
    nickname: '',
    avatarUrl: null,
  },
  loginWithKakao: () => set({ isAuthenticated: true }),
  logout: () =>
    set({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      profile: { nickname: '', avatarUrl: null },
    }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  setProfile: (profile) => set({ profile }),
}));
