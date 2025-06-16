import { ChallengeVerificationStatusType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { ISOFormatString } from '@shared/types/date'

export type VerifyGroupChallengeResponse = {
  submittedAt: ISOFormatString
}

export type VerifyPersonalChallengeBody = {
  imageUrl: string
  content: string
}

export type VerifyVariables = {
  challengeId: number
  body: VerifyPersonalChallengeBody
}
/**
 * 개인 챌린지 인증 제출
 */
export const VerifyGroupChallenge = ({ challengeId, body }: VerifyVariables) => {
  return fetchRequest<VerifyGroupChallengeResponse>(ENDPOINTS.CHALLENGE.PERSONAL.VERIFY(challengeId), {
    body,
  })
}

export type PersonalChallengeVerificationResultResponse = {
  status: ChallengeVerificationStatusType
}

/** 개인 챌린지 인증 결과 조회 (롱폴링) */
export const PersonalChallengeVerificationResult = (personalChallengeId: number) => {
  return fetchRequest<PersonalChallengeVerificationResultResponse>(
    ENDPOINTS.CHALLENGE.PERSONAL.VERIFICATION_RESULT(personalChallengeId),
  )
}
