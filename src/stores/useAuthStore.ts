import { create } from 'zustand';

import type { UserProfile } from '@/types/auth';

const TOKEN_KEY = 'accessToken';

interface AuthState {
  /** 토큰을 가지고 있으면 로그인 상태로 본다. */
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  profile: UserProfile;
  setAccessToken: (token: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
  setProfile: (profile: UserProfile) => void;
}

const emptyProfile: UserProfile = { nickname: '', avatarUrl: null };

export const useAuthStore = create<AuthState>((set) => ({
  // 새로고침해도 로그인이 풀리지 않도록 localStorage 를 기준으로 삼는다.
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
  hasCompletedOnboarding: false,
  profile: emptyProfile,

  setAccessToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      profile: emptyProfile,
    });
  },

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  setProfile: (profile) => set({ profile }),
}));
