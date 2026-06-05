import { NextRequest, NextResponse } from 'next/server';

const getAllowedImageHosts = () => {
  const hosts = new Set<string>();

  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL?.trim();
  if (imageBaseUrl) {
    try {
      hosts.add(new URL(imageBaseUrl).hostname);
    } catch {
      // 잘못된 환경 변수 형식은 무시
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    try {
      hosts.add(new URL(appUrl).hostname);
    } catch {
      // 잘못된 환경 변수 형식은 무시
    }
  }

  if (process.env.VERCEL_URL) {
    hosts.add(process.env.VERCEL_URL);
  }

  return hosts;
};

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get('src');

  if (!src) {
    return NextResponse.json(
      { message: 'src 쿼리 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(src);
  } catch {
    return NextResponse.json(
      { message: '유효하지 않은 이미지 URL입니다.' },
      { status: 400 }
    );
  }

  if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
    return NextResponse.json(
      { message: 'http/https URL만 허용됩니다.' },
      { status: 400 }
    );
  }

  const allowedHosts = getAllowedImageHosts();
  if (allowedHosts.size > 0 && !allowedHosts.has(targetUrl.hostname)) {
    return NextResponse.json(
      { message: '허용되지 않은 이미지 도메인입니다.' },
      { status: 403 }
    );
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; GlobalNomadOGImageProxy/1.0; +https://globalnomad-team2.vercel.app)',
      },
      cache: 'force-cache',
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: '원본 이미지를 가져오지 못했습니다.' },
        { status: 502 }
      );
    }

    const contentType = response.headers.get('content-type');
    const body = await response.arrayBuffer();
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType?.startsWith('image/')
          ? contentType
          : 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch {
    return NextResponse.json(
      { message: '이미지 프록시 처리 중 오류가 발생했습니다.' },
      { status: 502 }
    );
  }
}
