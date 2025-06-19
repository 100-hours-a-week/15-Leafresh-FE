'use client'

import { useGroupChallengeVerificationResult } from '@features/challenge/hook/use-group-verification-result'
import { usePersonalChallengeVerificationResult } from '@features/challenge/hook/use-personal-verification-result'
import { usePollingStore } from '@shared/context/polling/long-polling-store'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/use-toast/useToast'

enum PollingTarget {
  PERSONAL_CHALLENGE_VERIFICATION_RESULT, // 개인 챌린지 인증 결과 조회
  GROUP_CHALLENGE_VERIFICATION_RESULT, // 단체 챌린지 인증 결과 조회
  FEEDBACK, // 개인 피드백
}

const PollingWatcher = () => {
  const openToast = useToast()
  const { polling, removePersonalChallengeId, removeGroupChallengeId } = usePollingStore()

  const { challenge, member } = polling

  const personalChallengeIdList: number[] = challenge.verification.personalChallengeIdList // 개인 챌린지 롱폴링ID
  const groupChallengeIdList: number[] = challenge.verification.groupChallengeIdList // 단체 챌린지 롱폴링ID

  /** 이벤트 핸들러 */
  // TODO: type=단체 챌린지 인증 제출 핸들링
  const handleOnCompleteChallenge = (type: PollingTarget, challengeId: number) => {
    // #1. 개인 챌린지 인증 제출
    if (type === PollingTarget.PERSONAL_CHALLENGE_VERIFICATION_RESULT) {
      removePersonalChallengeId(challengeId) // 챌린지 제거
      openToast(ToastType.Success, `개인 챌린지 인증 결과 도착!\n알림창을 확인해주세요`)
    }

    // #2. 단체 챌린지 인증 제출
    if (type === PollingTarget.GROUP_CHALLENGE_VERIFICATION_RESULT) {
      removeGroupChallengeId(challengeId) // 챌린지 제거
      openToast(ToastType.Success, `단체 챌린지 인증 결과 도착!\n알림창을 확인해주세요`)
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

      {groupChallengeIdList.map(challengeId => (
        <PollingChallengeResult
          key={challengeId}
          type={PollingTarget.GROUP_CHALLENGE_VERIFICATION_RESULT}
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
  const personalChallengeVerifyQuery = usePersonalChallengeVerificationResult(challengeId, {
    enabled: type === PollingTarget.PERSONAL_CHALLENGE_VERIFICATION_RESULT,
  })
  const groupChallengeVerifyQuery = useGroupChallengeVerificationResult(challengeId, {
    enabled: type === PollingTarget.GROUP_CHALLENGE_VERIFICATION_RESULT,
  })

  const data =
    type === PollingTarget.PERSONAL_CHALLENGE_VERIFICATION_RESULT
      ? personalChallengeVerifyQuery.data
      : groupChallengeVerifyQuery.data

  if (data) {
    const { data: result } = data
    // 인증 결과가 도착한 경우
    if (result.status === 'SUCCESS' || result.status === 'FAILURE') {
      onComplete(type, challengeId)
    }
  }

  return null
}

export default PollingWatcher
