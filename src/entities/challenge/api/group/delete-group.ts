import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type DeleteGroupChallengeResponse = {
  id: number
}

export type DeleteGroupChallengeVariables = {
  challengeId: number
}

/**
 * 챌린지 삭제 API
 */
export const DeleteGroupChallenge = ({ challengeId }: DeleteGroupChallengeVariables) => {
  return fetchRequest<DeleteGroupChallengeResponse>(ENDPOINTS.CHALLENGE.GROUP.DELETE(challengeId))
}
