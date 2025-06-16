'use client'

import { usePersonalChallengeVerificationResult } from '@features/challenge/hook/use-personal-verification-result'
import { usePollingStore } from '@shared/context/polling/PollingStore'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/useToast/useToast'

enum PollingTarget {
  PERSONAL_CHALLENGE_VERIFICATION_RESULT, // 개인 챌린지 인증 결과 조회
  GROUP_CHALLENGE_VERIFICATION_RESULT, // 단체 챌린지 인증 결과 조회
  FEEDBACK, // 개인 피드백
  GROUP_CHALLENGE_CREATE, // 단체 챌린지 생성 검열
}

const PollingWatcher = () => {
  const openToast = useToast()
  const { personalChallengeIds, removeChallengeId } = usePollingStore()

  /** 이벤트 핸들러 */
  // TODO: type=단체 챌린지 인증 제출 핸들링
  const handleOnCompleteChallenge = (type: PollingTarget, challengeId: number) => {
    // #1. 챌린지 제거
    removeChallengeId(challengeId)

    // #2.토스트 띄우기
    openToast(ToastType.Success, `인증 결과 도착!\n알림창을 확인해주세요`)
  }
  return (
    <>
      {personalChallengeIds.map(id => (
        <PollingChallengeResult
          key={id}
          type={PollingTarget.PERSONAL_CHALLENGE_VERIFICATION_RESULT}
          challengeId={id}
          onComplete={handleOnCompleteChallenge}
        />
      ))}
    </>
  )
}

interface PollingChallengeResultProps {
  challengeId: number
  type: PollingTarget
  onComplete: (type: PollingTarget, challengeId: number) => void
}
const PollingChallengeResult = ({ type, challengeId, onComplete }: PollingChallengeResultProps) => {
  const { data } = usePersonalChallengeVerificationResult(challengeId, {
    enabled: true,
  })

  if (data) {
    const { data: result } = data
    // 인증 결과가 도착한 경우
    if (result.status === 'SUCCESS' || result.status === 'FAILURE') {
      onComplete(PollingTarget.PERSONAL_CHALLENGE_VERIFICATION_RESULT, challengeId)
    }
  }

  return null
}

export default PollingWatcher
