import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { loginWithKakaoCode } from '@/apis/auth';
import Button from '@/components/common/Button';
import MobileLayout from '@/components/layout/MobileLayout';
import { KAKAO_REDIRECT_URI } from '@/lib/kakao';
import { useAuthStore } from '@/stores/useAuthStore';
import { takeRedirect } from '@/utils/auth';
import { textStyles } from '@/styles/tokens';

/** 카카오 동의 후 ?code= 를 들고 돌아오는 화면. 토큰으로 교환하고 넘긴다. */
export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [error, setError] = useState<string>();
  // StrictMode 의 이중 실행으로 인가 코드를 두 번 쓰지 않도록 막는다.
  const exchanged = useRef(false);

  const code = searchParams.get('code');
  const kakaoError = searchParams.get('error');

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    if (kakaoError) {
      setError('카카오 로그인이 취소됐어요.');
      return;
    }
    if (!code) {
      setError('인가 코드가 없어요.');
      return;
    }

    loginWithKakaoCode(code, KAKAO_REDIRECT_URI)
      .then(({ accessToken, isNewUser }) => {
        setAccessToken(accessToken);
        // 신규 가입자는 온보딩을 먼저 거친다. 기억해 둔 경로는 그대로 두고
        // 프로필 설정이 끝난 뒤에 꺼내 쓴다.
        if (isNewUser) {
          navigate('/onboarding', { replace: true });
          return;
        }
        navigate(takeRedirect() ?? '/home', { replace: true });
      })
      .catch((cause: Error) => setError(cause.message));
  }, [code, kakaoError, navigate, setAccessToken]);

  return (
    <MobileLayout variant="white" className="justify-center px-5">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <p className={`text-text-secondary ${textStyles['body-medium']}`}>
          {error ?? '로그인 중이에요...'}
        </p>
        {error && (
          <Button onClick={() => navigate('/login', { replace: true })}>
            다시 시도하기
          </Button>
        )}
      </div>
    </MobileLayout>
  );
}
