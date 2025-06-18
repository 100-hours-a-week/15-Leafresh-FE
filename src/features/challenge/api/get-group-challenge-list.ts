import { ChallengeCategoryType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { InfiniteScrollResponse } from '@shared/types/api'
import { ISOFormatString } from '@shared/types/date'

/**
 * 요청 파라미터 타입
 */
export interface FetchGroupChallengesParams {
  input?: string
  category?: string
  cursorId?: number
  cursorTimestamp?: string
  size?: number
}

/**
 * 단체 챌린지 아이템 타입
 */
export interface GroupChallengeItem {
  id: number
  title: string
  category: ChallengeCategoryType
  description: string
  thumbnailUrl: string
  leafReward: number
  startDate: ISOFormatString
  endDate: ISOFormatString
  remainingDay: number
  currentParticipantCount: number
}

/**
 * 응답 데이터 타입
 */
export type FetchGroupChallengesResponse = InfiniteScrollResponse<{
  groupChallenges: GroupChallengeItem[]
}>

/**
 * 단체 챌린지 목록 조회 (검색 및 카테고리 필터 포함)
 * GET /api/challenges/group?input=…&category=…&cursorId=…&cursorTimestamp=…
 */
export const fetchGroupChallenges = (params: FetchGroupChallengesParams) => {
  // query 객체에 undefined 값은 제외하고 문자열/숫자 타입으로만 전환
  const query: Record<string, string | number> = {}
  if (params.category && params.category !== 'ALL') query.category = params.category // (API SPEC) "전체" 인 경우에는 카테고리 쿼리 없이 요청
  if (params.input) query.input = params.input
  if (params.cursorId !== undefined) query.cursorId = params.cursorId
  if (params.cursorTimestamp) query.cursorTimestamp = params.cursorTimestamp

  return fetchRequest<FetchGroupChallengesResponse>(ENDPOINTS.CHALLENGE.GROUP.LIST, { query })
}
