import { ChallengeVerificationStatusType } from '@/entities/challenge/model'

import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type PersonalChallengeVerificationResultResponse = {
  status: ChallengeVerificationStatusType
}

/** 개인 챌린지 인증 결과 조회 (롱폴링) */
export const PersonalChallengeVerificationResult = (personalChallengeId: number) => {
  return fetchRequest<PersonalChallengeVerificationResultResponse>(
    ENDPOINTS.CHALLENGE.PERSONAL.VERIFICATION_RESULT(personalChallengeId),
  )
}
