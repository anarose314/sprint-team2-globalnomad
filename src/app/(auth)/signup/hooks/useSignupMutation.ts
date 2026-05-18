'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { LOGIN_PATH } from '@/shared/apis/auth/auth.constants';
import { signup } from '@/shared/apis/auth/signup';
import { useShowToast } from '@/shared/store/useToastStore';
import { getSafeRedirectPath } from '@/shared/utils/getSafeRedirectPath';

/**
 * 회원가입 mutation hook.
 *
 * BFF (`/api/auth/signup` Route Handler) 를 통해 회원가입을 진행한다.
 * Route Handler 가 회원가입 + 자동 로그인을 수행하고
 * 토큰을 httpOnly 쿠키로 자동 저장하므로,
 * 클라이언트 코드는 토큰을 직접 다루지 않는다.
 *
 * 응답 케이스:
 * - 정상 (user 있음): URL의 from query를 검증하여 해당 경로로,
 *                      없으면 메인 페이지로 이동
 * - 부분 실패 (message 만 있음): 사용자 알림 + 로그인 페이지로 유도,
 *                                  from query 보존하여 로그인 후 원래 경로로 갈 수 있도록 함
 *
 * `from` 값은 getSafeRedirectPath로 검증하여 open redirect 취약점을 방어한다.
 *
 * 에러 케이스별 처리는 호출부에서 mutate 의 onError 옵션으로.
 */
export const useSignupMutation = () => {
  const showToast = useShowToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      const from = searchParams.get('from');

      // 부분 실패 — 회원가입은 성공했지만 자동 로그인 실패
      // from 보존하여 로그인 페이지로 보냄 (로그인 후 원래 경로로 갈 수 있도록)
      if (!data.user && data.message) {
        showToast({
          theme: 'warning',
          message: data.message,
        });
        const loginPath = from
          ? `${LOGIN_PATH}?from=${encodeURIComponent(from)}`
          : LOGIN_PATH;
        router.push(loginPath);
        return;
      }

      // 정상 — 자동 로그인까지 됐으므로 from 경로(있으면)로 바로 redirect
      router.push(getSafeRedirectPath(from));
    },
  });
};
