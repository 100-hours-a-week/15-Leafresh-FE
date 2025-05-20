import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export interface CountResponse {
  status: number
  message: string
  data: {
    count: {
      notStarted: number
      ongoing: number
      completed: number
    }
  }
}

/**
 * 참여한 단체 챌린지 개수 조회
 * GET /api/members/challenges/group/participations/count
 */
export const fetchGroupParticipationsCount = () => {
  return fetchRequest<CountResponse>(ENDPOINTS.CHALLENGE.GROUP.COUNT)
}
