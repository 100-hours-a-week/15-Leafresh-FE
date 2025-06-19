'use client'

import { usePathname, useRouter } from 'next/navigation'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { sendGAEvent } from '@next/third-parties/google'

import LucideIcon from '@shared/components/lucide-icon/ui/lucide-icon'
import { theme } from '@shared/config/style/theme'
import { useAuth } from '@shared/hooks/use-auth/useAuth'

import { NAVBAR_TABS } from '../model/consts'

export const Navbar = (): ReactNode => {
  const router = useRouter()
  const pathname = usePathname()

  const { isLoggedIn } = useAuth()

  // 현재 경로가 어떤 탭인지 판단
  const isCurrentTab = (label: string) => {
    // 메인(/) 또는 /challenge로 시작하면서 /challenge/participate가 아닌 경우, /challenge/feed가 아닌 경우
    if (label === '챌린지')
      return (
        pathname === '/' ||
        (pathname.startsWith('/challenge') &&
          !pathname.startsWith('/challenge/participate') &&
          !pathname.startsWith('/challenge/group/feed'))
      )

    if (label === '인증') return pathname.startsWith('/challenge/participate')
    if (label === '피드') return pathname.startsWith('/challenge/group/feed')

    if (label === '피드') return false
    if (label === '상점') return pathname.startsWith('/store')
    if (label === '마이페이지') return pathname.startsWith('/member')
    return false
  }

  // TODO: 피드 기능 추가시 클릭 이벤트 리스너 핸들
  const navHandler = (label: string, href: string, index: number) => {
    sendGAEvent('event', `nav-${index + 1}`, { value: `${label} 내비게이션 항목 클릭` }) // GA: 로그 수집

    router.push(href)
  }

  return (
    <NavbarWrapper>
      {NAVBAR_TABS.map(({ label, icon, href }, index) => {
        const isActive: boolean = isCurrentTab(label)
        return (
          <NavButton key={label} onClick={() => navHandler(label, href, index)}>
            <LucideIcon
              name={icon}
              size={24}
              color={isActive ? 'lfBlack' : 'lfGray'}
              strokeWidth={isActive ? 2.2 : 2}
            />
            <Label active={isActive}>{label}</Label>
          </NavButton>
        )
      })}
    </NavbarWrapper>
  )
}

const NavbarWrapper = styled.nav`
  min-width: 300px;
  max-width: 430px;
  width: 100%;

  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  right: 0;

  display: grid;
  grid-template-columns: repeat(5, 1fr);

  height: 72px;
  background-color: ${theme.colors.lfWhite.base};
  border-top: 1px solid ${theme.colors.lfLightGray.base};

  z-index: 99;
`

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;

  background: none;
  border: none;
  cursor: pointer;
`

const Label = styled.span<{ active: boolean }>`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  margin-top: 4px;
  color: ${({ active }) => (active ? theme.colors.lfBlack.base : theme.colors.lfGray.base)};
`
