import { z } from 'zod';

/**
 * 회원가입 폼 검증 스키마.
 *
 * - 이메일: 비어있으면 안내, 형식 어긋나면 형식 안내
 * - 닉네임: 비어있으면 안내, 10자 이내
 * - 비밀번호: 8자 이상
 * - 비밀번호 확인: 비밀번호와 일치
 */
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해 주세요.')
      .email('이메일 형식으로 작성해 주세요.')
      .transform((val) => val.trim().toLowerCase()),
    nickname: z
      .string()
      .trim()
      .min(1, '닉네임을 입력해 주세요.')
      .max(10, '닉네임은 10자 이내로 작성해 주세요.'),
    password: z
      .string()
      .min(1, '비밀번호를 입력해 주세요.')
      .min(8, '8자 이상 입력해 주세요.')
      .max(64, '비밀번호는 64자 이내로 입력해 주세요.'),
    passwordConfirm: z.string().min(1, '비밀번호를 한 번 더 입력해 주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

/**
 * 회원가입 폼 데이터 타입.
 */
export type SignupFormValues = z.infer<typeof signupSchema>;
