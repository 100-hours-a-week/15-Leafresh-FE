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
  const { polling, removePersonalChallengeId } = usePollingStore()

  const { challenge, member } = polling

  const personalChallengeIdList: number[] = challenge.verification.personalChallengeIdList // 개인 챌린지 롱폴링ID

  /** 이벤트 핸들러 */
  // TODO: type=단체 챌린지 인증 제출 핸들링
  const handleOnCompleteChallenge = (type: PollingTarget, challengeId: number) => {
    // #1. 개인 챌린지 인증 제출
    if (type === PollingTarget.PERSONAL_CHALLENGE_VERIFICATION_RESULT) {
      removePersonalChallengeId(challengeId) // 챌린지 제거
      openToast(ToastType.Success, `개인 챌린지 인증 결과 도착!\n알림창을 확인해주세요`) // 토스트 띄우기
    }
  }
  return (
    <>
      {personalChallengeIdList.map(challengeId => (
        <PollingChallengeResult
          key={challengeId}
          type={PollingTarget.PERSONAL_CHALLENGE_VERIFICATION_RESULT}
          challengeId={challengeId}
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
