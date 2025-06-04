import type { Metadata } from 'next'

import { GoogleAnalytics } from '@next/third-parties/google'

import ModalProvider from '@shared/components/modal/ModalProvider'
import Toast from '@shared/components/toast/Toast'
import ImageZoomModal from '@shared/components/zoommodal/ImageZoomModal/ImageZoomModal'
import { pretendard } from '@shared/config/font'
import AuthGuard from '@shared/config/providers/AuthGaurd'
import { Providers } from '@shared/config/providers/Providers'
import LayoutWrapper from '@shared/styles/LayoutWrapper'

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
  const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS
  return (
    <html lang='ko' className={`${pretendard.variable}`}>
      <body className={`${pretendard.className}`}>
        <Providers>
          <LayoutWrapper>
            <AuthGuard>{children}</AuthGuard>
          </LayoutWrapper>
          <ModalProvider />
          <ImageZoomModal />
          <Toast />
        </Providers>
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  )
}

export default RootLayout
