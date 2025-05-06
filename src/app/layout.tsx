import type { Metadata } from 'next'

import ConfirmModal from '@shared/components/modal/ConfirmModal'
import { pretendard } from '@shared/config/font'
import { Providers } from '@shared/config/providers/Providers'

import './globals.css'

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
          {children}
          <ConfirmModal />
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
