import onboarding1 from '@/assets/images/onboarding-1.png';
import onboarding2 from '@/assets/images/onboarding-2.png';
import onboarding3 from '@/assets/images/onboarding-3.png';
import type { OnboardingStep } from '@/types/auth';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: '추억을 미래로 전해보세요',
    description:
      '지금의 마음을 편지와 사진으로 남겨\n특별한 날 다시 만나보세요',
    image: onboarding1,
    imageAlt: '편지를 작성하는 모모 캐릭터',
    imageClassName: 'h-[424px] w-[318px]',
    containerPaddingTop: 'pt-0',
  },
  {
    id: 2,
    title: '함께 만드는 타임캡슐',
    description: '나에게, 친구에게, 또는 모두가 함께\n추억을 만들어보세요',
    image: onboarding2,
    imageAlt: '지도 위 함께 모인 모모 캐릭터들',
    imageClassName: 'h-[341px] w-[311px]',
    containerPaddingTop: 'pt-5',
  },
  {
    id: 3,
    title: 'AI가 추억을 더욱 특별하게',
    description: '감성을 담은 이미지를 생성해\n하나뿐인 타임캡슐을 완성해요',
    image: onboarding3,
    imageAlt: '사진을 들고 있는 모모 캐릭터',
    imageClassName: 'h-[319px] w-[319px]',
    containerPaddingTop: 'pt-[60px]',
  },
];
