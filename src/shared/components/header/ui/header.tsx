'use client'

import { useRouter } from 'next/navigation'

import { URL } from '@shared/constants/route/route'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import LogoImage from '@public/image/logo.svg'

import * as S from './styles'

interface HeaderProps {
  padding: number
}

export const Header = ({ padding }: HeaderProps) => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  return (
    <S.HeaderContainer>
      <S.CustomWidthWrapper padding={padding}>
        <S.LogoWrapper onClick={() => router.push(URL.MAIN.INDEX.value)}>
          <S.StyledImage src={LogoImage} alt='Leafresh 로고' priority />
        </S.LogoWrapper>
        <S.MenuButtons>
          <S.AlarmButton name='Bell' size={24} strokeWidth={2.5} onClick={() => router.push(URL.MEMBER.ALARM.value)} />
        </S.MenuButtons>
      </S.CustomWidthWrapper>
    </S.HeaderContainer>
  )
}
