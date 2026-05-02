import type { NextConfig } from 'next';

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
if (!imageUrl) {
  throw new Error(
    '🚨 NEXT_PUBLIC_IMAGE_URL 환경 변수가 누락되었습니다. .env 파일을 확인해주세요!'
  );
}
const imageHostname = new URL(imageUrl).hostname;

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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: imageHostname,
      },
    ],
  },
};

export default nextConfig;
