'use client'
import ChallengeCreateButton from '@features/challenge/components/challenge/ChallengeCreateButton'
import { Navbar } from '@shared/components'
import Chatbot from '@shared/components/chatbot/Chatbot'
import Header from '@shared/components/header/ui/header'
import { theme } from '@shared/config/style/theme'

import styled from '@emotion/styled'

const WIDTH_PADDING = 20

const WithHeaderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <ContentsWrapper>
        <Header padding={WIDTH_PADDING} />
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
  /* padding-bottom: 24px; */

  position: relative;
  display: flex;
  flex-direction: column;

  overflow-y: auto;
`

const Main = styled.main`
  width: 100%;

  margin-top: 24px;
  margin-bottom: 72px;
  padding-bottom: 24px;
  flex: 1;

  position: relative;

  background-color: ${theme.colors.lfWhite.base};
`
