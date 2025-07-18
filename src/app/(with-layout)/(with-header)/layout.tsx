'use client'
import styled from '@emotion/styled'

import { ChallengeCreateButton } from '@/features/challenge/components'
import { Chatbot } from '@/features/chatbot/components'

import { Header, Navbar } from '@/shared/components'
import { theme } from '@/shared/config'

const WIDTH_PADDING = 20

const WithHeaderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <Header padding={WIDTH_PADDING} />
      <ContentsWrapper>
        <Main>{children}</Main>
      </ContentsWrapper>
      <Chatbot />
      <ChallengeCreateButton />
      <Navbar />
    </>
  )
}

export default WithHeaderLayout

const ContentsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 72px;
  /* padding-bottom: 24px; */

  position: relative;
  display: flex;
  flex-direction: column;

  overflow-y: auto;
`

const Main = styled.main`
  width: 100%;

  margin-top: 24px;

  padding-bottom: 24px;
  flex: 1;

  position: relative;

  background-color: ${theme.colors.lfWhite.base};
`
