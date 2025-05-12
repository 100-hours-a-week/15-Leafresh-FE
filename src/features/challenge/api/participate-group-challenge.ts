import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

type ParticipateGroupChallengeResponseType = ApiResponse<{
  id: number
}>

/**
 * 닉네임 중복 검사 API
 */
export const ParticipateGroupChallenge = (challengeId: number) => {
  return fetchRequest<ParticipateGroupChallengeResponseType>(ENDPOINTS.CHALLENGE.GROUP.PARTICIPATE(challengeId))
}
