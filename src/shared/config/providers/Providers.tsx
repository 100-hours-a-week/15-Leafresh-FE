'use client'

import { ReactNode } from 'react'

import { theme } from '../style'
import { ChakraUseProvider } from './chakra-provider'
import { TanstackQueryProvider } from './tanstack-provider'

import { GlobalStyle } from '@/shared/styles'
import { ThemeProvider } from '@emotion/react'

/**
 * 전역 Layout.tsx에 지정되는 Provider를 모아두는 저장소입니다.
 * 동일 경로에 Provider를 생성 후, 적용해주세요
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <TanstackQueryProvider>
        <ChakraUseProvider>{children}</ChakraUseProvider>
      </TanstackQueryProvider>
    </ThemeProvider>
  )
}
