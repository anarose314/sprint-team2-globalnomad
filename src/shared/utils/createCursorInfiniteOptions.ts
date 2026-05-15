import { infiniteQueryOptions, QueryKey } from '@tanstack/react-query';

interface CursorResponse {
  cursorId?: number | null;
}

const DEFAULT_STALE_TIME = 60 * 1000;

/**
 * 커서 기반 무한 스크롤 쿼리 옵션을 생성하는 팩토리 함수
 *
 * @example
 * ```ts
 * const options = createCursorInfiniteOptions(QUERY_KEYS.MY_ACTIVITIES, fetchMyActivities);
 * ```
 */
export const createCursorInfiniteOptions = <T extends CursorResponse>(
  queryKey: QueryKey,
  fetchFn: (params: { pageParam: number | null }) => Promise<T>,
  { staleTime = DEFAULT_STALE_TIME }: { staleTime?: number } = {}
) => {
  return infiniteQueryOptions({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchFn({ pageParam: pageParam as number | null }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.cursorId ?? undefined,
    staleTime,
  });
};
