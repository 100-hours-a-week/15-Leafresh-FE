'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'

import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'
import LogoImage from '@public/image/logo.svg'

interface HeaderProps {
  height: number
  padding: number
}
const Header = ({ height, padding }: HeaderProps) => {
  return (
    <Container height={height} padding={padding}>
      <LogoWrapper>
        <StyledImage src={LogoImage} alt='Leafresh 로고' priority />
      </LogoWrapper>
      <MenuButton>
        <Menu size={24} strokeWidth={2.5} />
      </MenuButton>
    </Container>
  )
}

export default Header

const Container = styled.header<{ height: number; padding: number }>`
  width: 100%;
  height: ${({ height }) => `${height}px`};

  padding: ${({ padding }) => `0px ${padding}px`};
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${theme.colors.lfWhite.base};
  border-bottom: 1px solid ${theme.colors.lfBlack.base};
`

const LogoWrapper = styled.div`
  height: 60%;

  position: relative;
  display: flex;
  align-items: center;
`
const StyledImage = styled(Image)`
  height: 100%;
`

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
`
