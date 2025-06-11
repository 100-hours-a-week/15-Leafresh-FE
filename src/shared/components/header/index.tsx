'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { URL } from '@shared/constants/route/route'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import LogoImage from '@public/image/logo.svg'

import styled from '@emotion/styled'

interface HeaderProps {
  padding: number
}

const Header = ({ padding }: HeaderProps) => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  return (
    <HeaderContainer>
      <CustomWidthWrapper padding={padding}>
        <LogoWrapper onClick={() => router.push(URL.MAIN.INDEX.value)}>
          <StyledImage src={LogoImage} alt='Leafresh 로고' priority />
        </LogoWrapper>
        <MenuButtons>
          <AlarmButton name='Bell' size={24} strokeWidth={2.5} onClick={() => router.push(URL.MEMBER.ALARM.value)} />
        </MenuButtons>
      </CustomWidthWrapper>
    </HeaderContainer>
  )
}

export default Header

const HeaderContainer = styled.header`
  width: 100%;
  height: 60px;
  flex-shrink: 0;

  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.lfWhite.base};
  border-bottom: 1px solid ${theme.colors.lfLightGray.base};
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

const MenuButtons = styled.button`
  position: absolute;
  right: 35px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;

  background: none;
  border: none;
  cursor: pointer;
`

const AlarmButton = styled(LucideIcon)``
