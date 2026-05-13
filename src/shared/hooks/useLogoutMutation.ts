import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/shared/apis/apiError';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 로그아웃 mutation 훅.
 *
 * 흐름:
 * 1. /api/auth/logout 호출 (BFF가 httpOnly 쿠키 삭제)
 * 2. React Query 캐시 전체 클리어
 * 3. 토스트 노출 (full reload 전에 사용자가 인지하도록 잠시 대기)
 * 4. window.location으로 메인 페이지 full reload
 *    - router.push는 Next.js 클라이언트 캐시 때문에 뒤로가기 시 보호 페이지 복원 가능
 *    - 로그아웃은 명확한 세션 종료 액션이므로 full reload로 확실히 전환
 *
 * @example
 * ```ts
 * const { mutate: logout, isPending } = useLogoutMutation();
 * logout();
 * ```
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useShowToast();

  return useMutation<void, ApiError, void>({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', { method: 'POST' });

      if (!response.ok) {
        throw new ApiError('로그아웃에 실패했습니다.', response.status);
      }
    },
    onSuccess: () => {
      queryClient.clear();
      showToast({ theme: 'success', message: '로그아웃되었습니다.' });
      // 토스트 인지 시간 확보 후 full reload
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    },
    onError: (error) => {
      showToast({
        theme: 'error',
        message: error.message ?? '로그아웃에 실패했습니다.',
      });
    },
  });
};
