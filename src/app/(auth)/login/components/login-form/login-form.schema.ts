import { z } from 'zod';

/**
 * 로그인 폼 검증 스키마.
 *
 * - 이메일: 비어있으면 안내 메시지, 형식 어긋나면 형식 안내
 * - 비밀번호: 8자 이상
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해 주세요.')
    .email('이메일 형식으로 작성해 주세요.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해 주세요.')
    .min(8, '8자 이상 입력해 주세요.'),
});

/**
 * 로그인 폼 데이터 타입.
 * 스키마에서 자동 추출되어 검증 규칙과 항상 동기화된다.
 */
export type LoginFormValues = z.infer<typeof loginSchema>;
