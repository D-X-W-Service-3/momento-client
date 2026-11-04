const HTTP = 'http://';

/**
 * 이미지 주소를 https 로 바꾼다.
 *
 * 카카오 CDN 이 프로필 이미지를 http 로 내려주는데, 앱을 https 로 배포하면
 * mixed content 로 차단돼 아바타가 전부 깨진다. kakaocdn 은 https 도 제공하므로
 * 호스트는 그대로 두고 스킴만 올린다.
 *
 * blob:/data: 처럼 http 가 아닌 주소는 그대로 둔다 (파일 선택 미리보기 등).
 * null/undefined 여부는 그대로 유지해 호출부의 기본 이미지 처리를 방해하지 않는다.
 */
export function toSecureImageUrl<T extends string | null | undefined>(
  url: T,
): T {
  if (typeof url === 'string' && url.startsWith(HTTP)) {
    return `https://${url.slice(HTTP.length)}` as T;
  }
  return url;
}
