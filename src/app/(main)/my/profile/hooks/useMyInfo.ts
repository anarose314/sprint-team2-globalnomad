import { useQuery } from '@tanstack/react-query';
import { fetchMyInfo } from '@/app/(main)/my/profile/apis/myInfo';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

/**
 * 서버 프리패칭과 클라이언트 훅에서 공통으로 사용하는 내 정보 쿼리 옵션
 */
export const myInfoOptions = () => ({
  queryKey: QUERY_KEYS.MY_INFO,
  queryFn: fetchMyInfo,
});

/**
 * 내 정보를 가져오는 커스텀 훅
 *
 * @param options 쿼리 옵션 (enabled 등)
 *
 * @example
 * ```ts
 * // 기본 사용
 * const { data: user } = useMyInfo();
 *
 * // 조건부 호출 (비로그인 상태 회피 등)
 * const { data: user } = useMyInfo({ enabled: Boolean(initialUser) });
 * ```
 */
export const useMyInfo = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...myInfoOptions(),
    ...options,
  });
};
