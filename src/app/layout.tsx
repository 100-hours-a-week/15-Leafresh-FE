import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import ConfirmModal from '@shared/components/Modal/ConfirmModal'
import { EmotionCacheProvider } from '@shared/styles/emotion/emotion-cache'
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
        <EmotionCacheProvider>
          {children}
          <ConfirmModal />
        </EmotionCacheProvider>
      </body>
    </html>
  )
}

export default RootLayout
