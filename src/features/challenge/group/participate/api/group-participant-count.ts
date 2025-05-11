import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import type { ChallengeStatus } from './group-participant'

/** 응답 데이터가 number 하나인 경우 */
export interface CountResponse {
  status: number
  message: string
  data: number
}

/**
 * 참여한 단체 챌린지 개수 조회
 * GET /api/members/challenges/group/participations/count?status=…
 */
export const fetchGroupParticipationsCount = (params: { status: ChallengeStatus }): Promise<CountResponse> => {
  return fetchRequest(ENDPOINTS.CHALLENGE.CHALLENGE.GROUP.COUNT, {
    query: { status: params.status },
  })
}
