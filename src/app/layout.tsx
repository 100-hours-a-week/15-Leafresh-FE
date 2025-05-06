import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import ConfirmModal from '@shared/components/Modal/ConfirmModal'
import Toast from '@shared/components/Toast/Toast'
import { Providers } from '@shared/config/providers/Providers'
import GlobalScrollbarStyle from '@shared/styles/scrollbar/GlobalScrollbarStyle'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

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
    <html lang='ko'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GlobalScrollbarStyle />
        <Providers>
          {children}
          <ConfirmModal />
           <Toast/>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
