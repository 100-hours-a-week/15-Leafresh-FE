// src/features/challenge/group/participate/hook/useInfiniteGroupParticipations.ts
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query'
import { QUERY_KEYS } from '@shared/constants/tanstack-query/query-keys'
import {
  fetchGroupParticipations,
  type ChallengeStatus,
  type FetchGroupParticipationsParams,
} from '../api/group-participant'
import { ChallengeResponse } from '../api/group-participant'

export const useInfiniteGroupParticipations = (status: ChallengeStatus) =>
  useInfiniteQuery<
    // 1) queryFn이 반환하는 데이터 한 페이지 타입
    ChallengeResponse,
    // 2) 에러 타입
    Error,
    // 3) useInfiniteQuery가 data 속성으로 갖게 될 타입
    InfiniteData<ChallengeResponse>,
    // 4) queryKey 타입
    readonly [...typeof QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS, ChallengeStatus]
  >({
    queryKey: [...QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS, status] as const,

    // 첫 호출 땐 pageParam = {}, 이후엔 getNextPageParam 반환값이 들어옵니다.
    queryFn: async ({ pageParam = {} }) =>
      fetchGroupParticipations({
        ...(pageParam as FetchGroupParticipationsParams),
      }),

    getNextPageParam: lastPage => {
      const { hasNext, cursorInfo } = lastPage.data
      return hasNext
        ? {
            cursorId: cursorInfo.lastCursorId,
            cursorTimestamp: cursorInfo.cursorTimestamp,
          }
        : undefined
    },

    // 첫 호출 시 pageParam 기본값
    initialPageParam: {},

    staleTime: 5 * 60 * 1000, // 5분
  })
