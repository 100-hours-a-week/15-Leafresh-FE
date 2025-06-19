// components/GlobalWrapper.tsx
'use client'
import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { FeedBackButton } from '@shared/components/buttons/feedback-button/ui/feedback-button'
import Introduce from '@shared/components/introduce/ui/introduce'

import { theme } from '../config/style/theme'

const GlobalWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <EntirePageLayout>
      <Introduce />
      <ContentWrapper>{children}</ContentWrapper>
      <FeedBackButton />
    </EntirePageLayout>
  )
}

export default GlobalWrapper

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
  margin-right: 150px;

  min-width: 300px;
  max-width: 430px;
  width: 100%;
  height: 100dvh;
  background-color: ${theme.colors.lfWhite.base};

  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  box-shadow: 0 0 22px -2px #000000bf;

  @media (max-width: 1150px) {
    margin-right: 0px;
  }
`
