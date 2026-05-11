import { z } from 'zod';

/**
 * 카카오 회원가입 닉네임 폼 검증 스키마.
 *
 * 닉네임 규칙은 일반 회원가입과 동일하다.
 */
export const kakaoNicknameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, '닉네임을 입력해 주세요.')
    .max(10, '닉네임은 10자 이내로 작성해 주세요.'),
});

/**
 * 카카오 회원가입 닉네임 폼 데이터 타입.
 */
export type KakaoNicknameFormValues = z.infer<typeof kakaoNicknameSchema>;
