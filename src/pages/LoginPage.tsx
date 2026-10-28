import KakaoIcon from '@/assets/icons/kakao.svg?react';
import loginCharacter from '@/assets/images/login-character.png';
import Button from '@/components/common/Button';
import MobileLayout from '@/components/layout/MobileLayout';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';
import { textStyles } from '@/styles/tokens';

export default function LoginPage() {
  const { handleKakaoLogin } = useKakaoLogin();

  return (
    <MobileLayout
      variant="white"
      className="justify-between px-5 pt-[230px] pb-10"
    >
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center text-center">
          <p className={`text-text-secondary ${textStyles['body-medium']}`}>
            소중한 순간을 미래로
          </p>
          <h1 className={`text-primary ${textStyles['brand-logo']}`}>
            Momento
          </h1>
        </div>

        <img
          src={loginCharacter}
          alt="모멘토 캐릭터 모모"
          className="h-[216px] w-[216px] object-contain"
        />
      </div>

      <Button
        variant="kakao"
        leftIcon={<KakaoIcon className="h-[18px] w-[18px]" />}
        onClick={handleKakaoLogin}
      >
        카카오톡으로 로그인하기
      </Button>
    </MobileLayout>
  );
}
