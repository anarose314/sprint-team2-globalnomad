import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import {
  Activities,
  MyActivitiesResponse,
} from '@/shared/types/myActivities.types';

const DASHBOARD_MY_ACTIVITIES_SIZE = 20;

/**
 * 예약 현황 페이지 드롭다운에 노출할 내 체험 목록을 모두 조회한다.
 */
export const fetchAllMyActivitiesForDashboard = async (): Promise<
  Activities[]
> => {
  const mergedActivities: Activities[] = [];
  let cursorId: number | null = null;
  let hasNext = true;
  const seenCursorIds = new Set<number>();

  while (hasNext) {
    const data = await fetchInstanceClient<MyActivitiesResponse>(
      '/api/my-activities',
      {
        params: {
          size: DASHBOARD_MY_ACTIVITIES_SIZE,
          ...(cursorId !== null && { cursorId }),
        },
      }
    );

    mergedActivities.push(...data.activities);
    hasNext = data.cursorId !== null;

    if (data.cursorId === null) {
      cursorId = null;
      continue;
    }

    if (seenCursorIds.has(data.cursorId)) {
      break;
    }

    seenCursorIds.add(data.cursorId);
    cursorId = data.cursorId;
  }

  return mergedActivities;
};
