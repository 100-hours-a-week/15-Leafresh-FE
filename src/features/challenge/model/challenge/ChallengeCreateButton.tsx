'use client'

import { usePathname, useRouter } from 'next/navigation'

import { URL } from '@shared/constants/route/route'
import LucideIcon from '@shared/lib/ui/LucideIcon'

import styled from '@emotion/styled'
import { sendGAEvent } from '@next/third-parties/google'

const ChallengeCreateButton = () => {
  const pathname = usePathname()
  const router = useRouter()

  const handleCreateChallenge = () => {
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
