'use client'

import { ChallengeCategoryType } from '@entities/common/type'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import { getGroupChallengeFeedList } from '../../../../../entities/challenge/api/group/feed/get-feed-list'

import { useInfiniteQuery } from '@tanstack/react-query'

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
