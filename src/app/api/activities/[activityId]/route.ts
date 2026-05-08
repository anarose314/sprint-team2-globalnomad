import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

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
      ? `/activities/${activityId}?${queryString}`
      : `/activities/${activityId}`;

    const data = await fetchInstanceServer(endpoint, {
      method: 'GET',
    });

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
