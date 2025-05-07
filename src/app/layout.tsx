import type { Metadata } from 'next'

import ConfirmModal from '@shared/components/modal/ConfirmModal'
import InfoModal from '@shared/components/modal/InfoModal'
import Toast from '@shared/components/Toast/Toast'
import { pretendard } from '@shared/config/font'
import { Providers } from '@shared/config/providers/Providers'
import LayoutWrapper from '@shared/styles/LayoutWrapper'

export const metadata: Metadata = {
  title: 'Leafresh',
  description: '친환경 챌린지 서비스 Leafresh',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang='ko' className={`${pretendard.variable}`}>
      <body className={`${pretendard.className}`}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <ConfirmModal />
          <InfoModal />
          <Toast />
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
