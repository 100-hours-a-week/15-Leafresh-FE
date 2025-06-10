'use client'

import { usePathname, useRouter } from 'next/navigation'

import styled from '@emotion/styled'
import { sendGAEvent } from '@next/third-parties/google'

import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import LucideIcon from '@shared/lib/ui/LucideIcon'

const ChallengeCreateButton = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { isLoggedIn } = useAuth()
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
    <Container>
      <ButtonIcon name='Plus' color='lfWhite' size={24} onClick={handleCreateChallenge} />
    </Container>
  )
}

export default ChallengeCreateButton

// === Styles ===

const Container = styled.div`
  position: absolute;
  bottom: 90px;
  left: 16px;

  pointer-events: none;
  z-index: 999;

  display: flex;
  justify-content: center;

  width: 48px;
  aspect-ratio: 1/1;
`

const ButtonIcon = styled(LucideIcon)`
  width: 100%;
  height: 100%;
  pointer-events: auto;

  position: relative;

  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfGreenMain.hover};
  }
`
