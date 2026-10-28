import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/useAuthStore';

export function useKakaoLogin() {
  const navigate = useNavigate();
  const loginWithKakao = useAuthStore((state) => state.loginWithKakao);

  const handleKakaoLogin = () => {
    loginWithKakao();
    navigate('/onboarding');
  };

  return {
    handleKakaoLogin,
  };
}
