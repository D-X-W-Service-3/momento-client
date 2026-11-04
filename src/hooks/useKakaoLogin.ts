import { useState } from 'react';

import { getKakao, KAKAO_REDIRECT_URI } from '@/lib/kakao';

export function useKakaoLogin() {
  const [error, setError] = useState<string>();

  /** 카카오 동의 화면으로 보낸다. 돌아올 때 redirectUri 로 ?code= 가 붙는다. */
  const handleKakaoLogin = () => {
    const kakao = getKakao();
    if (!kakao) {
      setError('카카오 로그인 준비가 안 됐어요. 앱 키 설정을 확인해주세요.');
      return;
    }
    if (!KAKAO_REDIRECT_URI) {
      setError('Redirect URI 가 설정되지 않았어요.');
      return;
    }
    kakao.Auth.authorize({ redirectUri: KAKAO_REDIRECT_URI });
  };

  return { handleKakaoLogin, error };
}
