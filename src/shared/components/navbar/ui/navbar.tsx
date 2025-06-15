'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ReactNode } from 'react'

import { useAuth } from '@shared/hooks/use-auth/useAuth'
import LucideIcon from '@shared/lib/ui/LucideIcon'

import { NAVBAR_TABS } from '../model/consts'
import * as S from './styles'

import { sendGAEvent } from '@next/third-parties/google'

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
    <S.NavbarWrapper>
      {NAVBAR_TABS.map(({ label, icon, href }, index) => {
        const isActive: boolean = isCurrentTab(label)
        return (
          <S.NavButton key={label} onClick={() => navHandler(label, href, index)}>
            <LucideIcon
              name={icon}
              size={24}
              color={isActive ? 'lfBlack' : 'lfGray'}
              strokeWidth={isActive ? 2.2 : 2}
            />
            <S.Label active={isActive}>{label}</S.Label>
          </S.NavButton>
        )
      })}
    </S.NavbarWrapper>
  )
}
