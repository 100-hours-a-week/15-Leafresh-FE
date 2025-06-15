// components/LayoutWrapper.tsx
'use client'
import { ReactNode } from 'react'

import Introduce from '@shared/components/introduce/ui/Introduce'

import { theme } from './theme'

import styled from '@emotion/styled'

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <EntirePageLayout>
      <Introduce />
      <ContentWrapper>{children}</ContentWrapper>
    </EntirePageLayout>
  )
}

export default LayoutWrapper

const EntirePageLayout = styled.div`
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
  overflow-y: hidden;

  margin-right: 150px;

  @media (max-width: 1150px) {
    margin-right: 0px;
  }
`
