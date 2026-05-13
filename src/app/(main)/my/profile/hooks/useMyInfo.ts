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
 * 내 정보 페이지에서 사용하는 커스텀 훅
 *
 * @example
 * ```ts
 * const { data: user, isLoading, isError } = useMyInfo();
 * ```
 */
export const useMyInfo = () => {
  return useQuery(myInfoOptions());
};
