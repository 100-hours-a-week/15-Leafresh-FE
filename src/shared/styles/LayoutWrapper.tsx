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

  @media (max-width: 1150px) {
    justify-content: center;
  }
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

  margin-right: 150px;

  @media (max-width: 1150px) {
    margin-right: 0px;
  }
`
