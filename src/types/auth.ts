export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageClassName: string;
  containerPaddingTop: string;
}

export interface UserProfile {
  nickname: string;
  avatarUrl: string | null;
}

export interface KakaoLoginResponse {
  /** 이후 요청의 Authorization 헤더에 Bearer 로 담을 서비스 액세스 토큰 */
  accessToken: string;
  /** 이번 로그인으로 새로 가입한 회원인지 여부 */
  isNewUser: boolean;
}
