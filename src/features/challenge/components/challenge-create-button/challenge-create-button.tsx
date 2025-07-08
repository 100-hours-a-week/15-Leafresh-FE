'use client'

import { usePathname, useRouter } from 'next/navigation'

import { sendGAEvent } from '@next/third-parties/google'

import { URL } from '@/shared/constants'
import { useConfirmModalStore, useUserStore } from '@/shared/context'

import * as S from './styles'
import * as S from './styles'

export const ChallengeCreateButton = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { isLoggedIn } = useUserStore()
  const { openConfirmModal } = useConfirmModalStore()

  const handleCreateChallenge = () => {
    // #0. 로그인 상태가 아닐 때
    if (!isLoggedIn) {
      openConfirmModal({
        title: '챌린지 생성은 로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }
    sendGAEvent('event', 'group-create-step-1', { value: 'Step1: 챌린지 생성 버튼' }) // GA: 로그 수집
    router.push(URL.CHALLENGE.GROUP.CREATE.value())
  }

  // TODO: 피드 페이지 생성되면 넣기
  if (pathname !== URL.MAIN.INDEX.value && !pathname.startsWith('/feed')) return null
  return (
    <S.Container>
      <S.ButtonIcon name='Plus' color='lfWhite' size={24} onClick={handleCreateChallenge} />
    </S.Container>
  )
}
