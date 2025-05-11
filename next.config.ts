;/ @type {import('next').NextConfig} */
const nextConfig = {
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
