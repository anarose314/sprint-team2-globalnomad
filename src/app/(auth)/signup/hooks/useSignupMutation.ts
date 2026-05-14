'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { signup } from '@/shared/apis/auth/signup';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 회원가입 mutation hook.
 *
 * BFF (`/api/auth/signup` Route Handler) 를 통해 회원가입을 진행한다.
 * Route Handler 가 회원가입 + 자동 로그인을 수행하고
 * 토큰을 httpOnly 쿠키로 자동 저장하므로,
 * 클라이언트 코드는 토큰을 직접 다루지 않는다.
 *
 * 성공 시 메인 페이지로 리다이렉트한다.
 * 응답 케이스:
 * - 정상 (user 있음): 메인 페이지로 이동
 * - 부분 실패 (message 만 있음): 사용자 알림 + 로그인 페이지로 유도
 * 에러 케이스별 처리는 호출부에서 mutate 의 onError 옵션으로.
 */
export const useSignupMutation = () => {
  const showToast = useShowToast();
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      // 부분 실패 — 회원가입은 성공했지만 자동 로그인 실패
      if (!data.user && data.message) {
        showToast({
          theme: 'warning',
          message: data.message,
        });
        router.push('/login');
        return;
      }

      // 정상
      router.push('/');
    },
  });
};
