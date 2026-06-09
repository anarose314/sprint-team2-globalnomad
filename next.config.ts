import type { NextConfig } from 'next';

function parseEnvUrl(envName: string, value: string) {
  try {
    return new URL(value);
  } catch {
    throw new Error(
      `🚨 ${envName} 환경 변수 형식이 올바르지 않습니다. .env 파일을 확인해주세요!`
    );
  }
}

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
if (!imageUrl) {
  throw new Error(
    '🚨 NEXT_PUBLIC_IMAGE_URL 환경 변수가 누락되었습니다. .env 파일을 확인해주세요!'
  );
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!apiBaseUrl) {
  throw new Error(
    '🚨 NEXT_PUBLIC_API_BASE_URL 환경 변수가 누락되었습니다. .env 파일을 확인해주세요!'
  );
}

const parsedImageUrl = parseEnvUrl('NEXT_PUBLIC_IMAGE_URL', imageUrl);
const parsedApiBaseUrl = parseEnvUrl('NEXT_PUBLIC_API_BASE_URL', apiBaseUrl);

const imageHostname = parsedImageUrl.hostname;
const apiHostname = parsedApiBaseUrl.hostname;
const imageOrigin = `${parsedImageUrl.protocol}//${imageHostname}`;
const apiOrigin = `${parsedApiBaseUrl.protocol}//${apiHostname}`;
const imageRemotePatternProtocol = parsedImageUrl.protocol.replace(':', '');

const SECURITY_HEADERS = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dapi.kakao.com https://t1.daumcdn.net",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      `img-src 'self' data: blob: ${imageOrigin} https://t1.daumcdn.net https://*.daumcdn.net`,
      "font-src 'self' data: https://cdn.jsdelivr.net",
      `connect-src 'self' ${apiOrigin} https://dapi.kakao.com wss:`,
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: SECURITY_HEADERS,
      },
    ];
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol:
          imageRemotePatternProtocol === 'http' ? 'http' : ('https' as const),
        hostname: imageHostname,
      },
    ],
  },
};

export default nextConfig;
