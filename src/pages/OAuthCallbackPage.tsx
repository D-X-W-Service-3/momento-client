import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import MobileLayout from '@/components/layout/MobileLayout';
import { useKakaoCallback } from '@/hooks/useKakaoCallback';
import { textStyles } from '@/styles/tokens';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { error } = useKakaoCallback();
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
