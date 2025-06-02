'use client'
import styled from '@emotion/styled'

import { Navbar } from '@shared/components'
import Header from '@shared/components/header'
import { theme } from '@shared/styles/theme'

const WIDTH_PADDING = 20

const WithHeaderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <Header padding={WIDTH_PADDING} />
      <Main>{children}</Main>
      <Navbar />
    </>
  )
}

export default WithHeaderLayout

const Main = styled.main`
  width: 100%;
  flex: 1;

  position: relative;
  background-color: ${theme.colors.lfWhite.base};
  /* padding: 23px 0px; */
`
