const TOKEN_KEY = 'accessToken';
/** 로그인 때문에 중단된 경로. 카카오로 나갔다 돌아와도 같은 탭이라 살아있다. */
const REDIRECT_KEY = 'postLoginRedirect';

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);

export const setAccessToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);

export const clearAccessToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * sessionStorage 는 시크릿 모드나 차단 설정에서 던질 수 있다.
 * 로그인 흐름 자체를 막으면 안 되므로 실패는 조용히 넘긴다.
 */
export const rememberRedirect = (path: string) => {
  try {
    sessionStorage.setItem(REDIRECT_KEY, path);
  } catch {
    // 저장 못 하면 로그인 후 홈으로 간다.
  }
};

/** 한 번 꺼내면 지운다. 두 번 되돌아가는 일이 없도록. */
export const takeRedirect = () => {
  try {
    const path = sessionStorage.getItem(REDIRECT_KEY);
    if (path) sessionStorage.removeItem(REDIRECT_KEY);
    return path;
  } catch {
    return null;
  }
};

export const clearRedirect = () => {
  try {
    sessionStorage.removeItem(REDIRECT_KEY);
  } catch {
    // 무시
  }
};

/** 로그인 화면에서 또 로그인으로 보내면 루프가 된다. */
const isAuthRoute = (pathname: string) =>
  pathname === '/login' || pathname.startsWith('/oauth');

/**
 * 서버가 401 을 주면 세션이 끝난 것이다.
 * 토큰을 비우고, 보던 경로를 기억해 둔 뒤 로그인으로 보낸다.
 */
export function handleUnauthorized() {
  clearAccessToken();

  const { pathname, search } = window.location;
  if (isAuthRoute(pathname)) return;

  rememberRedirect(`${pathname}${search}`);
  window.location.replace('/login');
}
