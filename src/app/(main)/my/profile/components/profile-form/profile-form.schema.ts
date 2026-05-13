import { z } from 'zod';

/**
 * 마이페이지 내 정보 수정 폼 검증 스키마.
 *
 * - 닉네임: 비어있으면 안내, 10자 이내, 양쪽 공백 제거
 * - 비밀번호: 변경하지 않으려면 빈 문자열, 변경하려면 8자 이상 64자 이하
 * - 비밀번호 확인: 비밀번호와 일치
 *
 */
export const profileSchema = z
  .object({
    nickname: z
      .string()
      .trim()
      .min(1, '닉네임을 입력해 주세요.')
      .max(10, '닉네임은 10자 이내로 작성해 주세요.'),
    newPassword: z.union([
      z.literal(''),
      z
        .string()
        .min(8, '8자 이상 입력해 주세요.')
        .max(64, '비밀번호는 64자 이내로 입력해 주세요.'),
    ]),
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['newPasswordConfirm'],
  });

/**
 * 마이페이지 내 정보 수정 폼 데이터 타입.
 */
export type ProfileFormValues = z.infer<typeof profileSchema>;
