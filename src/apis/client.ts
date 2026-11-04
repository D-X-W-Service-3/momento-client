/**
 * 서버 공통 HTTP 클라이언트.
 * 모든 응답이 CommonResponse 로 감싸여 오므로 data 만 꺼내 돌려준다.
 */
import { getAccessToken, handleUnauthorized } from '@/utils/auth';

// ?? 는 빈 문자열을 걸러내지 못한다. .env 에 키만 있고 값이 비어 있는 경우가
// 많아 || 로 받아 vite 프록시 경로(/api)로 떨어지게 한다.
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

interface CommonResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

/** 서버가 code 로 구분해 주는 실패. 호출부에서 code 로 분기할 수 있다. */
export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions extends RequestInit {
  /**
   * 실패지만 화면에서는 정상 상태인 서버 code 목록.
   * (예: 아직 편지를 안 썼을 때의 LETTER_NOT_FOUND)
   * 이 code 로 실패하면 throw 하지 않고 null 을 돌려준다.
   */
  allowCodes?: string[];
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { allowCodes, ...init } = options;
  const token = getAccessToken();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  const raw = await response.text();
  let parsed: Partial<CommonResponse<T>> = {};
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    throw new ApiError(
      'INVALID_RESPONSE',
      `서버 응답을 읽을 수 없어요. (${response.status})`,
      response.status,
    );
  }

  if (!response.ok || parsed.code !== 'SUCCESS') {
    if (parsed.code && allowCodes?.includes(parsed.code)) {
      return null as T;
    }
    // 세션이 끝났으면 화면마다 따로 처리하지 않고 여기서 로그인으로 보낸다.
    if (response.status === 401) {
      handleUnauthorized();
    }
    throw new ApiError(
      parsed.code ?? 'UNKNOWN',
      parsed.message ?? '요청에 실패했어요.',
      response.status,
    );
  }
  return parsed.data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
