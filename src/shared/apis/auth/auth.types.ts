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
