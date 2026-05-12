import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

const resolveEndpoint = async (
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  const resolvedParams = await params;
  const joinedPath = resolvedParams.path.join('/');

  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();

  return queryString ? `/${joinedPath}?${queryString}` : `/${joinedPath}`;
};

const handleProxyRequest = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: 'GET' | 'DELETE'
) => {
  try {
    const endpoint = await resolveEndpoint(request, context);

    const data = await fetchInstanceServer<unknown>(endpoint, {
      method,
    });

    if (data === undefined || data === null) {
      return new NextResponse(null, { status: 204 });
    }

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

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => {
  return handleProxyRequest(request, context, 'GET');
};

export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => {
  return handleProxyRequest(request, context, 'DELETE');
};
