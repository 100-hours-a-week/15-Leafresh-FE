'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { getGroupChallengeFeedList } from '@/entities/challenge/api'
import { ChallengeCategoryType } from '@/entities/challenge/model'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

export const useInfiniteGroupChallengeFeedList = (category?: ChallengeCategoryType) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.FEED(category),
    queryFn: async ({ pageParam = {} }) => {
      return getGroupChallengeFeedList({
        ...pageParam,
        ...(category ? { category } : {}),
      })
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
    ...QUERY_OPTIONS.CHALLENGE.GROUP.FEED,
  })
}
