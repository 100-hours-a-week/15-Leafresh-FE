'use client'

import { ReactNode } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { sendGAEvent } from '@next/third-parties/google'

import { LucideIcon, NAVBAR_TABS } from '@/shared/components'
import { useAuth } from '@/shared/hooks'

import * as S from './styles'

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
          !pathname.startsWith('/challenge/group/feed') &&
          !(pathname.startsWith('/challenge/group') && pathname.includes('/verification/')))
      )

    if (label === '인증') {
      return pathname.startsWith('/member/challenge') && !pathname.startsWith('/member/challenge/create/list')
    }
    if (label === '피드')
      return (
        pathname.startsWith('/challenge/group/feed') ||
        (pathname.startsWith('/challenge/group') && pathname.includes('/verification/'))
      )

    if (label === '상점') return pathname.startsWith('/store')
    if (label === '마이페이지')
      return (
        pathname.startsWith('/member') &&
        (!pathname.startsWith('/member/challenge') || pathname === '/member/challenge/create/list')
      )
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
