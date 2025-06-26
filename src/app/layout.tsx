import { GoogleAnalytics } from '@next/third-parties/google'

import type { Metadata } from 'next'

import { pretendard, Providers, WebVitals } from '@/shared/config'

export const metadata: Metadata = {
  title: 'Leafresh',
  description: '친환경 챌린지 서비스 Leafresh',
  icons: {
    icon: '/icon/favicon.ico',
  },
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang='ko' className={`${pretendard.variable}`}>
      <body className={`${pretendard.className}`}>
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!} />
      {process.env.NODE_ENV === 'development' && <WebVitals />}
    </html>
  )
}

export default RootLayout
