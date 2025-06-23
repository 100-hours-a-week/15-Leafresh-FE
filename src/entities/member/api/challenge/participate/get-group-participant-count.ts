import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type GroupParticipationsCountResponse = {
  count: ParticipantStatus
}

export type ParticipantStatus = {
  notStarted: number
  ongoing: number
  completed: number
}

/**
 * 참여한 단체 챌린지 개수 조회
 * GET /api/members/challenges/group/participations/count
 */
export const getGroupParticipationsCount = () => {
  return fetchRequest<GroupParticipationsCountResponse>(ENDPOINTS.MEMBERS.CHALLENGE.GROUP.COUNT)
}
