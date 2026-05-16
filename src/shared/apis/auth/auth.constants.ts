/**
 * 인증 관련 상수.
 *
 * 쿠키 이름과 보안 옵션을 한 곳에서 관리하여,
 * Route Handler / fetchInstance.server / 미들웨어 등 여러 곳에서
 * 동일한 값을 참조하도록 한다.
 */

/**
 * accessToken 을 저장하는 httpOnly 쿠키 이름.
 */
export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';

/**
 * refreshToken 을 저장하는 httpOnly 쿠키 이름.
 */
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

/**
 * 인증 쿠키 공통 보안 옵션.
 *
 * - httpOnly: JavaScript 접근 불가 (XSS 방어)
 * - secure: production 환경에서만 HTTPS 전송 (개발 환경의 HTTP 호환)
 * - sameSite: strict 로 CSRF 방어
 * - path: 모든 경로에서 사용 가능
 */
const SHARED_AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

/**
 * accessToken 쿠키 옵션.
 * 만료 1일.
 */
export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...SHARED_AUTH_COOKIE_OPTIONS,
  maxAge: 60 * 60 * 24,
};

/**
 * refreshToken 쿠키 옵션.
 * 만료 30일. accessToken 만료 시 재발급에 사용.
 */
export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...SHARED_AUTH_COOKIE_OPTIONS,
  maxAge: 60 * 60 * 24 * 30,
};

/**
 * 카카오 회원가입 흐름에서 닉네임 입력을 받는 페이지 경로.
 * 콜백 페이지에서 이 경로로 redirect한다.
 */
export const KAKAO_SIGNUP_NICKNAME_PATH = '/signup/kakao';

/**
 * 인증 실패 및 비로그인 상태 시 리다이렉트할 기본 로그인 페이지 경로.
 *
 * @example
 * redirect(`${LOGIN_PATH}?from=/activity/${activityId}/edit`);
 */
export const LOGIN_PATH = '/login';
