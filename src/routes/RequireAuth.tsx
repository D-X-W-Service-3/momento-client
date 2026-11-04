import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { getAccessToken, rememberRedirect } from '@/utils/auth';

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * 로그인이 있어야 열리는 화면을 감싼다.
 *
 * 초대 링크처럼 외부에서 바로 들어오는 경로가 대상이다. 토큰 없이 들어오면
 * 서버가 401 을 줘서 빈 화면이 되므로, 요청을 보내기 전에 막고 로그인으로
 * 보낸 뒤 원래 경로로 되돌린다.
 */
export default function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();

  if (!getAccessToken()) {
    rememberRedirect(`${location.pathname}${location.search}`);
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
