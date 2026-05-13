import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { ReservationDashboardDailyItem } from '@/shared/types/reservationDashboard.types';

interface FetchReservationDashboardProps {
  activityId: number;
  year: number;
  month: number;
}

interface ReservationDashboardResponseLike {
  reservations?: unknown;
  data?: unknown;
}

const extractReservationDashboardList = (response: unknown): unknown[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== 'object') {
    return [];
  }

  const { reservations, data } = response as ReservationDashboardResponseLike;

  if (Array.isArray(reservations)) {
    return reservations;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

/**
 * 선택한 내 체험의 월별 예약 현황을 조회한다.
 */
export const fetchReservationDashboard = async ({
  activityId,
  year,
  month,
<<<<<<< HEAD
}: FetchReservationDashboardProps): Promise<
  ReservationDashboardDailyItem[]
> => {
  const params = {
    year,
    month: String(month).padStart(2, '0'),
  };

  return await fetchInstanceClient<ReservationDashboardDailyItem[]>(
    `/api/proxy/my-activities/${activityId}/reservation-dashboard`,
    { params }
  );
=======
}: FetchReservationDashboardProps) => {
  const response = await fetchInstanceClient<unknown>(
    `/api/my-activities/${activityId}/reservation-dashboard`,
    {
      params: {
        year,
        month: String(month).padStart(2, '0'),
      },
    }
  );

  const candidateList = extractReservationDashboardList(response);

  return candidateList
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const reservationItem = item as {
        date?: unknown;
        reservations?: {
          completed?: unknown;
          confirmed?: unknown;
          pending?: unknown;
        };
      };

      if (typeof reservationItem.date !== 'string') return null;

      return {
        date: reservationItem.date,
        reservations: {
          completed:
            typeof reservationItem.reservations?.completed === 'number'
              ? reservationItem.reservations.completed
              : 0,
          confirmed:
            typeof reservationItem.reservations?.confirmed === 'number'
              ? reservationItem.reservations.confirmed
              : 0,
          pending:
            typeof reservationItem.reservations?.pending === 'number'
              ? reservationItem.reservations.pending
              : 0,
        },
      } satisfies ReservationDashboardDailyItem;
    })
    .filter((item): item is ReservationDashboardDailyItem => item !== null);
>>>>>>> e124db3 (✨ Feat: 월별 예약 API연동 및 이벤트 뱃지 상태관리)
};
