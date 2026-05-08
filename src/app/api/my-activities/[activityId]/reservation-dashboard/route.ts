import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { ReservationDashboardDailyItem } from '@/shared/types/reservationDashboard.types';

interface RouteContext {
  params: Promise<{
    activityId: string;
  }>;
}

export const GET = async (request: NextRequest, context: RouteContext) => {
  try {
    const { activityId } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/my-activities/${activityId}/reservation-dashboard?${queryString}`
      : `/my-activities/${activityId}/reservation-dashboard`;

    const data = await fetchInstanceServer<ReservationDashboardDailyItem[]>(
      endpoint,
      {
        method: 'GET',
      }
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
