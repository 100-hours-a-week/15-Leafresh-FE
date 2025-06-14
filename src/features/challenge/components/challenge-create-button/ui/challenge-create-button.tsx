'use client'

import { usePathname, useRouter } from 'next/navigation'

import { URL } from '@shared/constants/route/route'

import { ButtonIcon, Container } from './styles'

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
