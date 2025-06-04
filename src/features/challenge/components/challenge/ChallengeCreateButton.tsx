'use client'

import Link from 'next/link'

import styled from '@emotion/styled'
import { sendGAEvent } from '@next/third-parties/google'

import LucideIcon from '@shared/lib/ui/LucideIcon'

const ChallengeCreateButton = () => {
  const handleCreateChallenge = () => {
    sendGAEvent('event', 'group-create-step-1', { value: 'Step1: 챌린지 생성 버튼' }) // GA: 로그 수집
  }
  return (
    <Container>
      <Link href='/challenge/group/create' passHref onClick={handleCreateChallenge}>
        <Button name='Plus' color='lfWhite' size={24} />
      </Link>
    </Container>
  )
}

export default ChallengeCreateButton

// === Styles ===

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  pointer-events: none;
  z-index: 20;

  display: flex;
  justify-content: center;
  max-width: 430px;
  margin: 0 auto;
`

const Button = styled(LucideIcon)`
  pointer-events: auto;

  position: absolute;
  bottom: 96px;
  left: 16px;

  width: 48px;
  height: 48px;

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
