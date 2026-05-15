/**
 * API 요청 실패 시 HTTP 상태코드와 메시지를 함께 전달하기 위한 커스텀 에러 클래스입니다.
 *
 * @example
 * ```ts
 * try {
 *   await signup({ email, nickname, password });
 * } catch (error) {
 *   if (error instanceof ApiError && error.status === 409) {
 *     setEmailApiError(error.message);
 *   }
 * }
 * ```
 */

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message); // 부모 Error의 message 세팅
    this.name = 'ApiError'; // 에러 이름 (디버깅할 때 도움됨)
    this.status = status;
    this.data = data;
  }
}
