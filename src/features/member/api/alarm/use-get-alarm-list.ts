'use client'

import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { ChallengeAlarmList, ChallengeAlarmListParams, getChallengeAlarmList } from '@/entities/challenge/api'

import { QUERY_KEYS } from '@/shared/config'
import { ApiResponse } from '@/shared/lib'

export const useInfiniteChallengeAlarmList = () => {
  return useInfiniteQuery<
    ApiResponse<ChallengeAlarmList>, // fetch 반환 타입
    Error,
    InfiniteData<ApiResponse<ChallengeAlarmList>>,
    typeof QUERY_KEYS.MEMBER.NOTIFICATION.LIST
  >({
    queryKey: QUERY_KEYS.MEMBER.NOTIFICATION.LIST,
    queryFn: async ({ pageParam = {} }) => {
      const { cursorId, cursorTimestamp } = pageParam as ChallengeAlarmListParams
      return getChallengeAlarmList({ cursorId, cursorTimestamp })
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
}
