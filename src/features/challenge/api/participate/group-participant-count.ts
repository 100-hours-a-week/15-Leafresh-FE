import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

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
export const fetchGroupParticipationsCount = (): Promise<CountResponse> => {
  return fetchRequest(ENDPOINTS.CHALLENGE.GROUP.COUNT)
}
