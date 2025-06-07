import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

export interface GroupParticipationsCount {
  count: {
    notStarted: number
    ongoing: number
    completed: number
  }
}

/**
 * 참여한 단체 챌린지 개수 조회
 * GET /api/members/challenges/group/participations/count
 */
export const fetchGroupParticipationsCount = () => {
  return fetchRequest<GroupParticipationsCount>(ENDPOINTS.CHALLENGE.GROUP.COUNT)
}
