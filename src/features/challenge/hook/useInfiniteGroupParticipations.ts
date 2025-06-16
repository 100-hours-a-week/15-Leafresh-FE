import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import {
  type ChallengeStatus,
  type FetchGroupParticipationsParams,
  getGroupParticipations,
} from '../api/participate/group-participant'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'

export const useInfiniteGroupParticipations = (status: ChallengeStatus) =>
  useInfiniteQuery({
    queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS(status),
    queryFn: async ({ pageParam = {} }) => {
      const { cursorId, cursorTimestamp } = pageParam as FetchGroupParticipationsParams
      return getGroupParticipations({ status, cursorId, cursorTimestamp })
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
    ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS, // ✅ 공통 옵션 삽입
  })
