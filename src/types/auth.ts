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
