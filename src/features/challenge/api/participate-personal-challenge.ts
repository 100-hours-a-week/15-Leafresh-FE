import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ISOFormatString } from '@shared/types/date'

type ParticipateGroupChallengeResponseType = ApiResponse<{
  submittedAt: ISOFormatString
}>

type ParticipatePersonalChallengeBody = {
  imageUrl: string
  content: string
}
/**
 * 닉네임 중복 검사 API
 */
export const ParticipateGroupChallenge = (challengeId: number, body: ParticipatePersonalChallengeBody) => {
  return fetchRequest<ParticipateGroupChallengeResponseType>(ENDPOINTS.CHALLENGE.PERSONAL.VERIFY(challengeId), {
    body,
  })
}
