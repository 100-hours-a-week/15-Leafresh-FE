'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'

import { URL } from '@shared/constants/route/route'
import { useDrawerStore } from '@shared/context/slide-drawer/DrawerStore'
import { theme } from '@shared/styles/theme'
import LogoImage from '@public/image/logo.svg'

interface HeaderProps {
  height: number
  padding: number
}

const Header = ({ height, padding }: HeaderProps) => {
  const router = useRouter()
  const { open } = useDrawerStore()

  return (
    <HeaderContainer height={height}>
      <ContentWrapper padding={padding}>
        <CustomWidthWrapper padding={padding}>
          <LogoWrapper onClick={() => router.push(URL.MAIN.INDEX.value)}>
            <StyledImage src={LogoImage} alt='Leafresh 로고' priority />
          </LogoWrapper>
          <MenuButton onClick={open}>
            <Menu size={24} strokeWidth={2.5} />
          </MenuButton>
        </CustomWidthWrapper>
      </ContentWrapper>
    </HeaderContainer>
  )
}

export default Header

const HeaderContainer = styled.header<{ height: number }>`
  min-width: 320px;
  max-width: 500px;
  width: 100%;
  height: ${({ height }) => `${height}px`};

  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.lfWhite.base};
  border-bottom: 1px solid ${theme.colors.lfLightGray.base};

  z-index: 100;
`

const ContentWrapper = styled.div<{ padding: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 500px;

  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CustomWidthWrapper = styled.div<{ padding: number }>`
  width: 100%;
  padding: ${({ padding }) => `0px ${padding}px`};
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LogoWrapper = styled.div`
  cursor: pointer;
`

const StyledImage = styled(Image)`
  height: 40px;
  width: auto;
`

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`
