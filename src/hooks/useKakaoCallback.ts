import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { loginWithKakaoCode } from '@/apis/auth';
import { KAKAO_REDIRECT_URI } from '@/lib/kakao';
import { useAuthStore } from '@/stores/useAuthStore';
import type { KakaoLoginResponse } from '@/types/auth';
import { takeRedirect } from '@/utils/auth';

export function useKakaoCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [error, setError] = useState<string>();
  const { mutateAsync } = useMutation({
    mutationFn: (code: string) => loginWithKakaoCode(code, KAKAO_REDIRECT_URI),
    retry: false,
  });
  const request = useRef<{
    code: string;
    promise: Promise<KakaoLoginResponse>;
  } | null>(null);
  const code = params.get('code');
  const kakaoError = params.get('error');

  useEffect(() => {
    setError(undefined);
    if (kakaoError || !code || !KAKAO_REDIRECT_URI) {
      setError(
        kakaoError
          ? '카카오 로그인이 취소됐어요.'
          : !code
            ? '인가 코드가 없어요.'
            : 'Redirect URI가 설정되지 않았어요.',
      );
      return;
    }
    let active = true;
    // StrictMode 재실행에서도 일회용 인가 코드를 교환하는 요청은 공유한다.
    if (request.current?.code !== code) {
      request.current = { code, promise: mutateAsync(code) };
    }
    void request.current.promise
      .then(({ accessToken, isNewUser }) => {
        if (!active) return;
        void client.cancelQueries();
        client.removeQueries();
        setAccessToken(accessToken);
        // 신규 사용자의 복귀 경로는 프로필 설정이 끝난 뒤에 꺼낸다.
        navigate(isNewUser ? '/onboarding' : (takeRedirect() ?? '/home'), {
          replace: true,
        });
      })
      .catch((cause: Error) => {
        if (active) setError(cause.message);
      });
    return () => {
      active = false;
    };
  }, [code, kakaoError, mutateAsync, navigate, setAccessToken, client]);

  return { error };
}
