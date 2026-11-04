import { api } from '@/apis/client';
import type { KakaoLoginResponse } from '@/types/auth';

/** 카카오 인가 코드를 서비스 액세스 토큰으로 교환한다. */
export const loginWithKakaoCode = (code: string, redirectUri: string) =>
  api.post<KakaoLoginResponse>(
    '/v1/auth/kakao',
    { code, redirectUri },
    { auth: false },
  );

export const logout = () =>
  api.post<void>('/v1/auth/logout', undefined, {
    redirectOnUnauthorized: false,
  });
