'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/shared/apis/auth/login';
import { getSafeRedirectPath } from '@/shared/utils/getSafeRedirectPath';

/**
 * 로그인 mutation hook.
 *
 * BFF (`/api/auth/login` Route Handler) 를 통해 로그인을 진행한다.
 * 토큰은 Route Handler 가 httpOnly 쿠키로 자동 저장하므로,
 * 클라이언트 코드는 토큰을 직접 다루지 않는다.
 *
 * 성공 시 URL의 `from` query를 검증하여 해당 경로로, 없으면 메인 페이지로 리다이렉트한다.
 * (예: 비로그인 상태로 /my/profile 진입 → /login?from=/my/profile → 로그인 → /my/profile)
 *
 * `from` 값은 getSafeRedirectPath로 검증하여 open redirect 취약점을 방어한다.
 *
 * 에러 케이스별 처리는 호출부에서 mutate 의 onError 옵션으로.
 */
export const useLoginMutation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // 토큰은 Route Handler 가 httpOnly 쿠키로 저장 — 여기서 처리 X
      const from = searchParams.get('from');
      router.push(getSafeRedirectPath(from));
    },
  });
};
