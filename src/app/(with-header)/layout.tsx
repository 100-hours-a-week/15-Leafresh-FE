'use client'
import styled from '@emotion/styled'

import Footer from '@shared/components/footer'
import Header from '@shared/components/header'
import { theme } from '@shared/styles/theme'

const HEADER_HEIGHT = 60
const WIDTH_PADDING = 35

const WithHeaderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <Header height={HEADER_HEIGHT} padding={WIDTH_PADDING} />
      <Main marginTop={HEADER_HEIGHT}>{children}</Main>
      <Footer padding={WIDTH_PADDING} />
    </>
  )
}

export default WithHeaderLayout

const Main = styled.main<{ marginTop: number }>`
  min-height: calc(100dvh - ${({ marginTop }) => `${marginTop}px`});

  position: relative;
  margin-top: ${({ marginTop }) => `${marginTop}px`};
  width: 100%;
  background-color: ${theme.colors.lfWhite.base};
  padding: 23px ${WIDTH_PADDING}px;
`
