'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import LogoImage from '@public/image/logo.svg'

import { BackButton, LucideIcon } from '@/shared/components'
import { theme } from '@/shared/config'
import { URL } from '@/shared/constants'
import styled from '@emotion/styled'

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
    <HeaderContainer>
      <CustomWidthWrapper padding={padding}>
        {!hasBackButton ? (
          <LogoWrapper onClick={() => router.push(URL.MAIN.INDEX.value)}>
            <StyledImage src={LogoImage} alt='Leafresh 로고' priority />
          </LogoWrapper>
        ) : (
          <BackButton />
        )}
        <MenuButtons>
          <AlarmButton name='Bell' size={24} strokeWidth={2.5} onClick={() => router.push(URL.MEMBER.ALARM.value)} />
        </MenuButtons>
      </CustomWidthWrapper>
    </HeaderContainer>
  )
}

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
