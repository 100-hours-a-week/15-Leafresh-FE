import {
  fetchGroupChallenges,
  type FetchGroupChallengesParams,
  type FetchGroupChallengesResponse,
} from '@entities/challenge/api/get-group-challenge-list'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ApiResponse } from '@shared/lib/api/type'

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

/**
 * 단체 챌린지 목록 조회를 위한 React Query 훅 (무한 스크롤)
 * @param category - 필터할 챌린지 카테고리 (string) - 빈 문자열이면 전체 조회
 * @param input - 검색어 (string)
 */
export const useInfiniteGroupChallenges = (category: string, input: string) =>
  useInfiniteQuery<
    // 한 페이지당 반환되는 데이터 타입
    ApiResponse<FetchGroupChallengesResponse>,
    // 에러 타입
    Error,
    // 최종 Data 타입: FetchGroupChallengesResponse 그대로 사용
    InfiniteData<ApiResponse<FetchGroupChallengesResponse>>,
    // Query Key 타입
    readonly [...ReturnType<typeof QUERY_KEYS.CHALLENGE.GROUP.LIST>]
  >({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.LIST(category, input),
    queryFn: ctx => {
      const params = ctx.pageParam as FetchGroupChallengesParams
      return fetchGroupChallenges({
        category: category || undefined,
        input: input || undefined,
        cursorId: params.cursorId,
        cursorTimestamp: params.cursorTimestamp,
      })
    },
    getNextPageParam: last =>
      last.data.hasNext
        ? {
            cursorId: last.data.cursorInfo.lastCursorId,
            cursorTimestamp: last.data.cursorInfo.cursorTimestamp,
          }
        : undefined,
    initialPageParam: {},
    staleTime: 5 * 60 * 1000, // 5분
  })
