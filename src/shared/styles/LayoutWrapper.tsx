// components/LayoutWrapper.tsx
'use client'
import { ReactNode } from 'react'
import styled from '@emotion/styled'

import Introduce from '@shared/components/introduce/Introduce'

import { theme } from './theme'

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <WrapperContainer>
      <Introduce />
      <ContentWrapper>{children}</ContentWrapper>
    </WrapperContainer>
  )
}

export default LayoutWrapper

const WrapperContainer = styled.div`
  width: 100%;

  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

const ContentWrapper = styled.div`
  min-width: 300px;
  max-width: 430px;
  width: 100%;
  height: 100dvh;
  background-color: ${theme.colors.lfWhite.base};

  position: relative;
  display: flex;
  flex-direction: column;

  overflow-x: hidden;

  /* overflow-y: auto; */
`
