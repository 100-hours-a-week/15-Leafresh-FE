'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'

import { URL } from '@shared/constants/route/route'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import LogoImage from '@public/image/logo.svg'

interface HeaderProps {
  height: number
  padding: number
}

const Header = ({ height, padding }: HeaderProps) => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  return (
    <HeaderContainer height={height}>
      <CustomWidthWrapper padding={padding}>
        <LogoWrapper onClick={() => router.push(URL.MAIN.INDEX.value)}>
          <StyledImage src={LogoImage} alt='Leafresh 로고' priority />
        </LogoWrapper>
        <MenuButtons>
          {isLoggedIn && <AlarmButton name='Bell' size={24} onClick={() => router.push(URL.MEMBER.ALARM.value)} />}
        </MenuButtons>
      </CustomWidthWrapper>
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
  top: 0; /* 반드시 명시해야 함 */
  /* left: 0; 명시해도 문제 없음 */

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.lfWhite.base};

  z-index: 100;
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
