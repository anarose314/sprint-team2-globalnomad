import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

/**
 * `/api/proxy/[...path]` 요청의 catch-all 경로와 쿼리를 조합해
 * 백엔드 endpoint 문자열 생성
 * - dynamic path segment를 `/a/b/c` 형태로 합치고
 * - query string이 있으면 그대로 보존
 */
const resolveEndpoint = async (
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
 * 공통 프록시 요청 처리 (Body 없음)
 *
 * GET/DELETE 같은 Body 없는 메서드를 주입받아 서버 fetch 래퍼를 호출하고,
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
 * 공통 프록시 요청 처리 (Body 포함)
 *
 * 요청의 Content-Type에 따라 일반 JSON 또는 multipart/form-data를 안전하게 파싱하여 백엔드로 전달합니다.
 * JSON 파싱 실패 시 undefined로 처리하여 Body가 비어있는 요청도 유연하게 허용합니다.
 *
 * @example
 * export const POST = async (req, ctx) => handleProxyRequestWithBody(req, ctx, 'POST');
 */
const handleProxyRequestWithBody = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: 'POST' | 'PATCH' | 'PUT'
) => {
  try {
    const endpoint = await resolveEndpoint(request, context);
    const contentType = request.headers.get('content-type') ?? '';

    let requestBody: Record<string, unknown> | FormData | undefined = undefined;

    if (contentType.includes('multipart/form-data')) {
      requestBody = await request.formData();
    } else if (contentType.includes('application/json')) {
      const jsonBody = await request.json().catch(() => undefined);
      requestBody =
        jsonBody && typeof jsonBody === 'object'
          ? (jsonBody as Record<string, unknown>)
          : undefined;
    }

    const data = await fetchInstanceServer<unknown>(endpoint, {
      method,
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

/**
 * 라우트 핸들러 export
 */
export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => handleProxyRequest(request, context, 'GET');

export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => handleProxyRequest(request, context, 'DELETE');

export const POST = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => handleProxyRequestWithBody(request, context, 'POST');

export const PATCH = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => handleProxyRequestWithBody(request, context, 'PATCH');

export const PUT = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => handleProxyRequestWithBody(request, context, 'PUT');
