// components/LayoutWrapper.tsx
'use client'
import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { theme } from './theme'

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  return <Container>{children}</Container>
}

export default LayoutWrapper

const Container = styled.div`
  min-width: 320px;
  max-width: 500px;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: ${theme.colors.lfWhite.base};
  display: flex;
  flex-direction: column;
`
