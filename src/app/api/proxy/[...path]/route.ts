import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

const buildEndpoint = async (
  request: NextRequest,
  params: Promise<{ path: string[] }>
) => {
  const resolvedParams = await params;
  const joinedPath = resolvedParams.path.join('/');
  const queryString = request.nextUrl.searchParams.toString();

  return queryString ? `/${joinedPath}?${queryString}` : `/${joinedPath}`;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  try {
    const endpoint = await buildEndpoint(request, params);

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

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  try {
    const endpoint = await buildEndpoint(request, params);
    const jsonBody = await request.json().catch(() => undefined);
    const requestBody =
      jsonBody && typeof jsonBody === 'object'
        ? (jsonBody as Record<string, unknown>)
        : undefined;

    const data = await fetchInstanceServer(endpoint, {
      method: 'PATCH',
      body: requestBody,
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
