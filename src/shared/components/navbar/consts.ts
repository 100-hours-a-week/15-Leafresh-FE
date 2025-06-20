import { icons } from 'lucide-react'

import { URL } from '@/shared/constants'

type Navbar_Tab = {
  label: string
  icon: keyof typeof icons
  href: string // 경로
}
export const NAVBAR_TABS: Navbar_Tab[] = [
  { label: '챌린지', icon: 'CheckCheck', href: URL.MAIN.INDEX.value }, // 단체 챌린지 목록 페이지
  { label: '인증', icon: 'Camera', href: URL.MEMBER.CHALLENGE.PARTICIPATE.LIST.value }, // 참여중인 챌린지
  { label: '피드', icon: 'MessageCircleMore', href: URL.CHALLENGE.GROUP.FEED.value },
  { label: '상점', icon: 'ShoppingCart', href: URL.STORE.INDEX.value }, //
  { label: '마이페이지', icon: 'User', href: URL.MEMBER.PROFILE.MYPAGE.value },
]
