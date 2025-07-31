import type { NextConfig } from 'next'

const runtimeEnv = process.env.NEXT_PUBLIC_RUNTIME

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
    break
  default:
    throw new Error(`Unknown Image Route NEXT_PUBLIC_RUNTIME: ${runtimeEnv}`)
}

const nextConfig: NextConfig = {
  /* config options here d*/
  compiler: {
    emotion: true,
  },
  // TurboPack 설정
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com/**', // 정확히 이 도메인이어야 함
        // pathname: `/${gcsHostname}/**`, // 해당 경로 하위 모든 이미지 허용
      },
      {
        protocol: 'https',
        hostname: 'leafresh-images.s3.ap-northeast-2.amazonaws.com', // 정확히 이 도메인이어야 함
        pathname: `/**`, // 해당 경로 하위 모든 이미지 허용
      },
      {
        protocol: 'http',
        hostname: '**.kakaocdn.net',
      },
    ],
  },
  webpack: config => {
    // @ts-expect-error 타입 에러 무시
    const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'))

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              ext: 'tsx',
            },
          },
        ],
      },
    )
    fileLoaderRule.exclude = /\.svg$/i
    return config
  },
}

module.exports = nextConfig
