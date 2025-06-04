// components/LayoutWrapper.tsx
'use client'
import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { theme } from './theme'

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  return <WrapperContainer>{children}</WrapperContainer>
}

export default LayoutWrapper

const WrapperContainer = styled.div`
  min-width: 300px;
  max-width: 430px;
  width: 100%;
  height: 100dvh;
  background-color: ${theme.colors.lfWhite.base};

  position: relative;
  display: flex;
  flex-direction: column;

  overflow-x: hidden;
  overflow-y: auto;
`
