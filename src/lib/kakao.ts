/** Kakao JS SDK 중 실제로 쓰는 부분만 선언한다. */
interface KakaoSdk {
  isInitialized: () => boolean;
  init: (jsKey: string) => void;
  Auth: {
    authorize: (settings: { redirectUri: string }) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

export const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI ?? '';

/**
 * SDK 를 1회만 초기화한다.
 * index.html 의 스크립트가 아직 안 붙었거나 키가 비어 있으면 null 을 준다.
 */
export function getKakao(): KakaoSdk | null {
  const kakao = window.Kakao;
  if (!kakao) return null;

  const jsKey = import.meta.env.VITE_KAKAO_JS_KEY;
  if (!jsKey) return null;

  if (!kakao.isInitialized()) kakao.init(jsKey);
  return kakao;
}
