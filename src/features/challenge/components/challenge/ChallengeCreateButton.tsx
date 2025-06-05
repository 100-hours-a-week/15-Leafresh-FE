'use client'

import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'
import { sendGAEvent } from '@next/third-parties/google'

import { URL } from '@shared/constants/route/route'
import LucideIcon from '@shared/lib/ui/LucideIcon'

const ChallengeCreateButton = () => {
  const router = useRouter()
  const handleCreateChallenge = () => {
    sendGAEvent('event', 'group-create-step-1', { value: 'Step1: 챌린지 생성 버튼' }) // GA: 로그 수집
    router.push(URL.CHALLENGE.GROUP.CREATE.value())
  }
  return (
    <Container>
      <ButtonIcon name='Plus' color='lfWhite' size={24} onClick={handleCreateChallenge} strokeWidth={2.5} />
    </Container>
  )
}

export default ChallengeCreateButton

// === Styles ===

const Container = styled.div`
  position: sticky;
  bottom: 90px;
  left: 16px;

  pointer-events: none;
  z-index: 999;

  display: flex;
  justify-content: center;

  width: 52px;
  aspect-ratio: 1/1;
`

const ButtonIcon = styled(LucideIcon)`
  width: 100%;
  height: 100%;
  pointer-events: auto;

  position: relative;

  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.extraLight};

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
