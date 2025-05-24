import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ApiResponse } from '@shared/lib/api/fetcher/fetcher'

import {
  MemberGroupChallengeCreations,
  MemberGroupChallengeCreationsResponse,
} from '../api/challenge/get-group-creations'

export const useInfiniteMemberGroupChallengeCreations = () => {
  return useInfiniteQuery<
    ApiResponse<MemberGroupChallengeCreationsResponse>, // fetch 반환 타입
    Error,
    InfiniteData<ApiResponse<MemberGroupChallengeCreationsResponse>>,
    typeof QUERY_KEYS.MEMBER.CHALLENGE.GROUP.CREATIONS
  >({
    queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.CREATIONS,
    queryFn: async ({ pageParam = undefined }) => MemberGroupChallengeCreations(pageParam ?? {}),
    ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.CREATIONS,
    initialPageParam: undefined,

    getNextPageParam: lastPage => {
      const { hasNext, cursorInfo } = lastPage.data
      return hasNext
        ? {
            cursorId: cursorInfo.lastCursorId,
            cursorTimestamp: cursorInfo.cursorTimestamp,
          }
        : undefined
    },
  })
}
