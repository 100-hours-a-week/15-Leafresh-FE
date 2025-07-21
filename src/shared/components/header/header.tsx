'use client'

import { usePathname, useRouter } from 'next/navigation'

import { BackButton } from '@/shared/components'
import { BACK_BUTTON_ROUTES, convertToRegexPattern, URL } from '@/shared/constants'

import * as S from './styles'
interface HeaderProps {
  padding: number
}

const BACK_BUTTON_REGEX = BACK_BUTTON_ROUTES.map(convertToRegexPattern)

export const Header = ({ padding }: HeaderProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const hasBackButton: boolean = BACK_BUTTON_REGEX.some(regex => regex.test(pathname))

  return (
    <S.HeaderContainer>
      <S.CustomWidthWrapper padding={padding}>
        {!hasBackButton ? (
          <S.LogoWrapper onClick={() => router.push(URL.MAIN.INDEX.value)}>
            <S.StyledImage />
          </S.LogoWrapper>
        ) : (
          <BackButton />
        )}
        <S.MenuButtons>
          <S.AlarmButton name='Bell' size={24} strokeWidth={2.5} onClick={() => router.push(URL.MEMBER.ALARM.value)} />
        </S.MenuButtons>
      </S.CustomWidthWrapper>
    </S.HeaderContainer>
  )
}
