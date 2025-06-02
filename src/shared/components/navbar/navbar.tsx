'use client'

import { useRouter } from 'next/navigation'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { useAuth } from '@shared/hooks/useAuth/useAuth'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

import { NAVBAR_TABS } from './tabs'

export const Navbar = (): ReactNode => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  return (
    <NavbarWrapper>
      {NAVBAR_TABS.map(({ label, icon, href }) => (
        <NavButton key={label} onClick={() => router.push(href)}>
          <LucideIcon name={icon} size={24} />
          <Label>{label}</Label>
        </NavButton>
      ))}
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

  color: ${theme.colors.lfDarkGray.base};

  &:hover {
    color: ${theme.colors.lfGreenMain.base};
  }
`

const Label = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  margin-top: 4px;
`
