import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

/**
 * `/api/proxy/[...path]` 요청의 catch-all 경로와 쿼리를 조합해
 * 백엔드 endpoint 문자열 생성
 * - dynamic path segment를 `/a/b/c` 형태로 합치고
 * - query string이 있으면 그대로 보존
 */
const buildEndpoint = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => {
  const resolvedParams = await context.params;
  const joinedPath = resolvedParams.path.join('/');
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();

  return queryString ? `/${joinedPath}?${queryString}` : `/${joinedPath}`;
};

/**
 * 공통 프록시 요청 처리
 *
 * GET/DELETE 같은 body 없는 메서드를 주입받아 서버 fetch 래퍼를 호출하고,
 * API 에러를 클라이언트 응답 형태로 변환
 */
const handleProxyRequest = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: 'GET' | 'DELETE'
) => {
  try {
    const endpoint = await buildEndpoint(request, context);

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

/**
 * PATCH 프록시 처리
 * - request.json() 파싱 실패 시 undefined로 처리해
 *   body 없는 PATCH도 백엔드로 전달
 */
export const PATCH = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => {
  try {
    const endpoint = await buildEndpoint(request, context);
    const jsonBody = await request.json().catch(() => undefined);
    const requestBody =
      jsonBody && typeof jsonBody === 'object'
        ? (jsonBody as Record<string, unknown>)
        : undefined;

    const data = await fetchInstanceServer(endpoint, {
      method: 'PATCH',
      body: requestBody,
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
