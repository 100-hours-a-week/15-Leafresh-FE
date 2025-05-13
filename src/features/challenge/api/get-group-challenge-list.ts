import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

/**
 * 요청 파라미터 타입
 */
export interface FetchGroupChallengesParams {
  input?: string
  category?: string
  cursorId?: number
  cursorTimestamp?: string
}

/**
 * 단체 챌린지 아이템 타입
 */
export interface GroupChallengeItem {
  id: number
  title: string
  thumbnailUrl: string
  leafReward: number
  startDate: string
  endDate: string
  remainingDay: number
  currentParticipantCount: number
}

/**
 * 응답 데이터 타입
 */
export interface FetchGroupChallengesResponse
  extends ApiResponse<{
    items: GroupChallengeItem[]
    hasNext: boolean
    cursorInfo: {
      lastCursorId: number
      cursorTimestamp: string
    }
  }> {}

/**
 * 단체 챌린지 목록 조회 (검색 및 카테고리 필터 포함)
 * GET /api/challenges/group?input=…&category=…&cursorId=…&cursorTimestamp=…
 */
export const fetchGroupChallenges = (params: FetchGroupChallengesParams): Promise<FetchGroupChallengesResponse> => {
  // query 객체에 undefined 값은 제외하고 문자열/숫자 타입으로만 전환
  const query: Record<string, string | number> = {}
  if (params.category) query.category = params.category
  if (params.input) query.input = params.input
  if (params.cursorId !== undefined) query.cursorId = params.cursorId
  if (params.cursorTimestamp) query.cursorTimestamp = params.cursorTimestamp

  return fetchRequest<FetchGroupChallengesResponse>(ENDPOINTS.CHALLENGE.GROUP.LIST, { query })
}
