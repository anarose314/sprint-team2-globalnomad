/**
 * 사용자 정보.
 *
 * API 응답의 user 필드 구조와 일치한다.
 */
export type User = {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
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
 * 로그인 API 성공 응답.
 */
export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
