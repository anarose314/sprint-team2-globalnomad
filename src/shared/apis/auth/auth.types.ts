/**
 * 사용자 정보.
 * API 응답의 user 필드 구조와 일치한다.
 */
export type User = {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * 로그인 API 요청 바디.
 */
export type LoginRequest = {
  email: string;
  password: string;
};

/**
 * 백엔드의 로그인 응답.
 *
 * BFF (Route Handler) 가 백엔드를 호출할 때 받는 형태.
 * 클라이언트는 직접 이 형태를 받지 않는다.
 */
export type LoginBackendResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

/**
 * 클라이언트가 BFF (Route Handler) 에서 받는 응답.
 * 토큰은 httpOnly 쿠키로 처리되므로 바디에는 user 정보만 포함된다.
 */
export type LoginResponse = {
  user: User;
};

/**
 * 회원가입 API 요청 바디.
 */
export type SignupRequest = {
  email: string;
  nickname: string;
  password: string;
};

/**
 * 클라이언트가 BFF (Route Handler) 에서 받는 회원가입 응답.
 *
 * Route Handler 가 회원가입 후 자동 로그인을 수행하므로,
 * 클라이언트는 LoginResponse 와 동일한 형태로 user 정보만 받는다.
 * - 정상: { user } — 회원가입 + 자동 로그인 둘 다 성공
 * - 부분 실패: { message } — 회원가입은 성공했지만 자동 로그인 실패
 */
export type SignupResponse = {
  user?: User;
  message?: string;
};

/**
 * 카카오 간편 회원가입 API 요청 바디.
 *
 * - token: 카카오에서 받은 인가 코드 (백엔드 가이드상 'token'이라는 명칭이지만 실제론 인가 코드)
 * - redirectUri: 인가 코드 발급 시 사용한 redirect_uri (백엔드가 카카오 토큰 교환에 사용)
 * - nickname: 우리 서비스에서 쓸 닉네임
 */
export type KakaoSignupRequest = {
  token: string;
  redirectUri: string;
  nickname: string;
};

/**
 * 백엔드의 카카오 회원가입 응답 (BFF가 받는 형태).
 */
export type KakaoSignupBackendResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

/**
 * 클라이언트가 BFF에서 받는 카카오 회원가입 응답.
 * 토큰은 httpOnly 쿠키로 처리되므로 바디에는 user 정보만 포함된다.
 */
export type KakaoSignupResponse = {
  user: User;
};
