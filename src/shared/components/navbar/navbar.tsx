'use client'

import { usePathname, useRouter } from 'next/navigation'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { URL } from '@shared/constants/route/route'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

import { NAVBAR_TABS } from './tabs'

export const Navbar = (): ReactNode => {
  const router = useRouter()
  const pathname = usePathname()

  const { isLoggedIn } = useAuth()

  // 현재 경로가 어떤 탭인지 판단
  const isCurrentTab = (label: string) => {
    if (label === '홈') return pathname === URL.MAIN.INDEX.value
    if (label === '챌린지') return pathname.startsWith('/challenge') && !pathname.startsWith('/challenge/participate')
    if (label === '인증') return pathname.startsWith('/challenge/participate')
    if (label === '상점') return pathname.startsWith('/store')
    if (label === '마이페이지') return pathname.startsWith('/member')
    return false
  }

  return (
    <NavbarWrapper>
      {NAVBAR_TABS.map(({ label, icon, href }) => {
        const isActive: boolean = isCurrentTab(label)
        return (
          <NavButton key={label} onClick={() => router.push(href)}>
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

  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  right: 0;

  display: flex;
  justify-content: space-around;
  align-items: center;

  height: 72px;
  background-color: ${theme.colors.lfWhite.base};
  border-top: 1px solid ${theme.colors.lfLightGray.base};

  z-index: 999;
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
