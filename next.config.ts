import type { NextConfig } from 'next'

const runtimeEnv = process.env.NEXT_PUBLIC_RUNTIME

let gcsHostname: string

switch (runtimeEnv) {
  case 'local':
    gcsHostname = 'leafresh-gcs-images'
    break
  case 'dev':
    gcsHostname = 'leafresh-gcs-images'
    break
  case 'prod':
    gcsHostname = 'leafresh-prod-images'
    break
  default:
    throw new Error(`Unknown Image Route NEXT_PUBLIC_RUNTIME: ${runtimeEnv}`)
}

const nextConfig: NextConfig = {
  /* config options here d*/
  compiler: {
    emotion: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // 정확히 이 도메인이어야 함
        pathname: `/${gcsHostname}/**`, // 해당 경로 하위 모든 이미지 허용
      },
      {
        protocol: 'http',
        hostname: '**.kakaocdn.net',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.[jt]sx?$/], // js, ts, jsx, tsx 파일에서만 처리
      },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true, // width/height를 1em으로 만들어 icon처럼 사용 가능
          },
        },
      ],
    })

    return config
  },
}

module.exports = nextConfig
