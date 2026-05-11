import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  try {
    const resolvedParams = await params;
    const joinedPath = resolvedParams.path.join('/');

    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/${joinedPath}?${queryString}`
      : `/${joinedPath}`;

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
