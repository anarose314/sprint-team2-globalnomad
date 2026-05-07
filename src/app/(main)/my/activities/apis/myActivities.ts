import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { MyActivitiesResponse } from '@/shared/types/myActivities.types';

interface FetchMyActivitiesProps {
  pageParam?: number | null;
}

/**
 * 내 체험 리스트를 가져오는 API 호출 함수 (BFF 경유)
 */
const fetchMyActivities = async ({
  pageParam = null,
}: FetchMyActivitiesProps) => {
  const params = {
    size: 5,
    ...(pageParam && { cursorId: pageParam }),
  };

  return await fetchInstanceClient<MyActivitiesResponse>('/api/my-activities', {
    params,
  });
};

/**
 * 내 체험 관리 페이지에서 사용하는 무한 스크롤 커스텀 훅
 * 서버 컴포넌트에서 초기 데이터(initialData)를 주입받아 하이드레이션 없이 빠른 초기 렌더링 지원
 *
 * @example
 * ```ts
 * // 컴포넌트 내부에서 사용 시
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyActivitiesInfinite(initialData);
 * ```
 */
export const useMyActivitiesInfinite = (initialData: MyActivitiesResponse) => {
  return useInfiniteQuery({
    queryKey: ['myActivities'],
    queryFn: fetchMyActivities,
    initialPageParam: null,

    getNextPageParam: (lastPage) => lastPage.cursorId || undefined,

    initialData: {
      pages: [initialData],
      pageParams: [null],
    },
  });
};
