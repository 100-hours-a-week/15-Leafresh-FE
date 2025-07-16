'use client'

import { usePathname, useRouter } from 'next/navigation'

import { BackButton } from '@/shared/components'
import { URL } from '@/shared/constants'

import * as S from './styles'
interface HeaderProps {
  padding: number
}

/** 보호가 필요한 경로 목록 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractBackButtonRoutes(obj: any): string[] {
  const result: string[] = []

  for (const key in obj) {
    const entry = obj[key]
    if (typeof entry === 'object' && entry !== null) {
      if (entry.hasBackButton) {
        if (typeof entry.value === 'string') {
          result.push(entry.value)
        } else if (typeof entry.dynamicPath === 'string') {
          result.push(entry.dynamicPath)
        }
      }
      result.push(...extractBackButtonRoutes(entry))
    }
  }

  return result
}

const BACK_BUTTON_ROUTES = extractBackButtonRoutes(URL).map(path =>
  path.includes('[') ? path.replace(/\[.*?\]/g, '\\d+') : path,
)

export const Header = ({ padding }: HeaderProps) => {
  const router = useRouter()
  const pathname = usePathname()

  // 보호 경로인지 판별
  const hasBackButton: boolean = BACK_BUTTON_ROUTES.some(pattern => {
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(pathname)
  })

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
