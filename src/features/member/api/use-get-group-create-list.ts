import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ApiResponse } from '@shared/lib/api/type'

import {
  MemberGroupChallengeCreations,
  MemberGroupChallengeCreationsResponse,
} from '../../../entities/member/api/challenge/get-group-create-list'

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

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
