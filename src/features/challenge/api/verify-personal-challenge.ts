import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ISOFormatString } from '@shared/types/date'

type VerifyGroupChallengeResponseType = ApiResponse<{
  submittedAt: ISOFormatString
}>

export type VerifyPersonalChallengeBody = {
  imageUrl: string
  content: string
}

type VerifyVariables = {
  challengeId: number
  body: VerifyPersonalChallengeBody
}
/**
 * 개인 챌린지 인증 제출
 */
export const VerifyGroupChallenge = ({ challengeId, body }: VerifyVariables) => {
  return fetchRequest<VerifyGroupChallengeResponseType>(ENDPOINTS.CHALLENGE.PERSONAL.VERIFY(challengeId), {
    body,
  })
}
