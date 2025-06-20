import { fetchGroupChallenges, FetchGroupChallengesParams } from '@/entities/challenge/api'
import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { useInfiniteQuery } from '@tanstack/react-query'

/**
 * 단체 챌린지 목록 조회를 위한 React Query 훅 (무한 스크롤)
 * @param category - 필터할 챌린지 카테고리 (string) - 빈 문자열이면 전체 조회
 * @param input - 검색어 (string)
 */
export const useInfiniteGroupChallenges = (category: string, input: string) =>
  useInfiniteQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.LIST(category, input),
    queryFn: ctx => {
      const params = ctx.pageParam as FetchGroupChallengesParams
      return fetchGroupChallenges({
        category: category || undefined,
        input: input || undefined,
        cursorId: params.cursorId,
        cursorTimestamp: params.cursorTimestamp,
      })
    },
    getNextPageParam: last =>
      last.data.hasNext
        ? {
            cursorId: last.data.cursorInfo.lastCursorId,
            cursorTimestamp: last.data.cursorInfo.cursorTimestamp,
          }
        : undefined,
    initialPageParam: {},
    ...QUERY_OPTIONS.CHALLENGE.GROUP.LIST,
  })
