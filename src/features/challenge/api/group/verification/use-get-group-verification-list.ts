import { useInfiniteQuery } from '@tanstack/react-query'

import { getGroupChallengeParticipateList, GroupChallengeParticipateListParams } from '@/entities/challenge/api'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

export const useInfiniteGroupChallengeVerifications = (challengeId: number) =>
  useInfiniteQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.LIST(challengeId),
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
    ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.LIST,
  })
