import { ChallengeStatus, FetchGroupParticipationsParams, getGroupParticipations } from '@/entities/member/api'
import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { useInfiniteQuery } from '@tanstack/react-query'

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
