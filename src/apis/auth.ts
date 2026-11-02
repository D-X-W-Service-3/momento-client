import type { KakaoLoginResponse, UserProfile } from '@/types/auth';

// ?? 는 빈 문자열을 걸러내지 못한다. .env 에 키만 있고 값이 비어 있는 경우가 많아
// || 로 받아 vite 프록시 경로(/api)로 떨어지게 한다.
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

/** 서버는 모든 응답을 CommonResponse 로 감싸서 준다. */
interface CommonResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const raw = await response.text();
  let parsed: Partial<CommonResponse<T>> = {};
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(`서버 응답을 읽을 수 없어요. (${response.status})`);
  }

  if (!response.ok || parsed.code !== 'SUCCESS') {
    throw new Error(parsed.message || '요청에 실패했어요.');
  }
  return parsed.data as T;
}

/** 카카오 인가 코드를 서비스 액세스 토큰으로 교환한다. */
export const loginWithKakaoCode = (code: string, redirectUri: string) =>
  post<KakaoLoginResponse>('/v1/auth/kakao', { code, redirectUri });

export const logout = () => post<void>('/v1/auth/logout');

// TODO: PATCH /v1/users/me 로 교체. 지금은 목이다.
export async function updateProfile(
  profile: UserProfile,
): Promise<UserProfile> {
  return Promise.resolve(profile);
}
