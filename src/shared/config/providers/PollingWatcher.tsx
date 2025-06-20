'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useGroupChallengeVerificationResult } from '@features/challenge/hook/use-group-verification-result'
import { usePersonalChallengeVerificationResult } from '@features/challenge/hook/use-personal-verification-result'
import { useFeedbackPolling } from '@features/member/hooks/useFeedbackPolling'
import { usePollingStore } from '@shared/context/polling/PollingStore'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/useToast/useToast'

import { QUERY_KEYS } from '../tanstack-query/query-keys'

enum PollingTarget {
  PERSONAL_CHALLENGE_VERIFICATION_RESULT, // 개인 챌린지 인증 결과 조회
  GROUP_CHALLENGE_VERIFICATION_RESULT, // 단체 챌린지 인증 결과 조회
  FEEDBACK, // 개인 피드백
}

const PollingWatcher = () => {
  const openToast = useToast()
  const { polling, removePersonalChallengeId, removeGroupChallengeId, clearFeedbackPolling } = usePollingStore()

  const { challenge, member } = polling

  const personalChallengeIdList: number[] = challenge.verification.personalChallengeIdList // 개인 챌린지 롱폴링ID
  const groupChallengeIdList: number[] = challenge.verification.groupChallengeIdList // 단체 챌린지 롱폴링ID
  const isFeedbackReceived: boolean = member.feedback

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
  // 피드백 요청
  const handleCompleteFeedback = (type: PollingTarget) => {
    if (type === PollingTarget.FEEDBACK) {
      clearFeedbackPolling()
      openToast(ToastType.Success, `피드백 도착!\n마이페이지를 확인해주세요`)
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

      {isFeedbackReceived && (
        <PollingFeedbackResult type={PollingTarget.FEEDBACK} onComplete={handleCompleteFeedback} />
      )}
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

interface FeedbackResultProps {
  type: PollingTarget
  onComplete: (type: PollingTarget) => void
}
const PollingFeedbackResult = ({ type, onComplete }: FeedbackResultProps) => {
  const FeedbackQuery = useFeedbackPolling({
    enabled: true,
  })

  const data = FeedbackQuery.data
  const queryClient = useQueryClient()

  useEffect(() => {
    if (data?.data?.content) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.FEEDBACK.GET_FEEDBACK })
      onComplete(type)
    }
  }, [data?.data?.content, onComplete, type])
  return null
}

export default PollingWatcher
