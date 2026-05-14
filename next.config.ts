import type { NextConfig } from 'next';

function parseImageHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    throw new Error(
      '🚨 NEXT_PUBLIC_IMAGE_URL 환경 변수 형식이 올바르지 않습니다. .env 파일을 확인해주세요!'
    );
  }
}

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
if (!imageUrl) {
  throw new Error(
    '🚨 NEXT_PUBLIC_IMAGE_URL 환경 변수가 누락되었습니다. .env 파일을 확인해주세요!'
  );
}

const imageHostname = parseImageHostname(imageUrl);

const nextConfig: NextConfig = {
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
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: imageHostname,
      },
    ],
  },
};

export default nextConfig;
