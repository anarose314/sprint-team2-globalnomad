import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

/**
 * catch-all 파라미터, 쿼리스트링을 조합해 백엔드 endpoint 생성
 */
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

/**
 * 공통 프록시 요청 처리
 *
 * GET/DELETE 같은 메서드를 주입받아 서버 fetch 래퍼를 호출하고,
 * API 에러를 클라이언트 응답 형태로 변환
 */
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

/**
 * GET 요청을 외부 API로 프록시
 */
export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => {
  return handleProxyRequest(request, context, 'GET');
};

/**
 * DELETE 요청을 외부 API로 프록시
 */
export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => {
  return handleProxyRequest(request, context, 'DELETE');
};
