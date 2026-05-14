import { useQuery } from '@tanstack/react-query';
import { fetchActivityDetail } from '@/app/(main)/activity/apis/activities';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

export const useActivityDetail = (activityId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ACTIVITIES, activityId],
    queryFn: () => fetchActivityDetail(activityId),
    enabled: !!activityId,
  });
};
