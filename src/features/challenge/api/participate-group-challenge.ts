import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

export type ParticipateGroupChallengeResponse = {
  id: number
}

export type ParticipateGroupChallengeVariables = {
  challengeId: number
}
/**
 * 단체 챌린지 참여 이력 생성
 */
export const ParticipateGroupChallenge = ({ challengeId }: ParticipateGroupChallengeVariables) => {
  return fetchRequest<ParticipateGroupChallengeResponse>(ENDPOINTS.CHALLENGE.GROUP.PARTICIPATE(challengeId))
}
