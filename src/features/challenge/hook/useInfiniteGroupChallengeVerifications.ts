import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ApiResponse } from '@shared/lib/api/fetcher/type'

import {
  getGroupChallengeParticipateList,
  GroupChallengeParticipateList,
  GroupChallengeParticipateListParams,
} from '../api/participate/get-group-participant-list'

export const useInfiniteGroupChallengeVerifications = (challengeId: number) =>
  useInfiniteQuery<
    ApiResponse<GroupChallengeParticipateList>, // queryFn 반환 타입
    Error, // 에러 타입
    InfiniteData<ApiResponse<GroupChallengeParticipateList>>, // data 타입
    ReturnType<typeof QUERY_KEYS.CHALLENGE.GROUP.VERIFICATIONS> // queryKey 타입 (함수형 키 대응)
  >({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATIONS(challengeId),
    queryFn: async ({ pageParam = {} }) => {
      const { cursorId, cursorTimestamp } = pageParam as GroupChallengeParticipateListParams
      return getGroupChallengeParticipateList({ challengeId, cursorId, cursorTimestamp })
    },
    getNextPageParam: lastPage => {
      const { hasNext, cursorInfo } = lastPage.data
      return hasNext
        ? {
            cursorId: cursorInfo.lastCursorId,
            cursorTimestamp: cursorInfo.cursorTimestamp,
          }
        : undefined
    },
    initialPageParam: {},
    staleTime: 5 * 60 * 1000,
  })
