import type { NextConfig } from 'next'

const runtimeEnv = process.env.NEXT_PUBLIC_RUNTIME
console.log(runtimeEnv)

let gcsHostname: string

switch (runtimeEnv) {
  case 'local':
    gcsHostname = 'leafresh-images'
    break
  case 'dev':
    gcsHostname = 'leafresh-images'
    break
  case 'prod':
    gcsHostname = 'leafresh-prod-images'
  default:
    gcsHostname = 'leafresh-images'
}

const nextConfig: NextConfig = {
  /* config options here d*/
  compiler: {
    emotion: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // 정확히 이 도메인이어야 함
        pathname: `/${gcsHostname}/**`, // 해당 경로 하위 모든 이미지 허용
      },
      {
        protocol: 'http',
        hostname: 'img1.kakaocdn.net',
      },
      {
        protocol: 'http',
        hostname: 't1.kakaocdn.net',
      },
    ],
  },
}

module.exports = nextConfig
