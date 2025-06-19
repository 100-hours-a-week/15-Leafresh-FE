import { useInfiniteQuery } from '@tanstack/react-query'

import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import {
  getGroupChallengeParticipateList,
  GroupChallengeParticipateListParams,
} from '../../../../../entities/challenge/api/group/verification/get-verification-list.js'

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
