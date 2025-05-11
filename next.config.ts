import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    emotion: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // 정확히 이 도메인이어야 함
        pathname: '/leafresh-images/', // 해당 경로 하위 모든 이미지 허용
      },
    ],
  },
}

module.exports = nextConfig
