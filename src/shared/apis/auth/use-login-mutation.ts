'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { login } from '@/shared/apis/auth/login';

/**
 * 로그인 mutation hook.
 *
 * 성공 시 토큰을 쿠키에 저장하고 메인 페이지로 리다이렉트.
 * 에러 케이스별 처리는 호출부에서 mutate 의 onError 옵션으로.
 */
export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // 토큰 쿠키 저장
      Cookies.set('accessToken', data.accessToken, { expires: 1 });
      Cookies.set('refreshToken', data.refreshToken, { expires: 30 });

      // 메인 페이지로 이동
      router.push('/');
    },
  });
};
