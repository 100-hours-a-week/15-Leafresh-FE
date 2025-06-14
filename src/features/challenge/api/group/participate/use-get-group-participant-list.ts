import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ApiResponse } from '@shared/lib/api/type'

import type { ParticipantChallengeResponse } from '../../../../../entities/member/api/challenge/participate/get-group-participant-list'
import {
  type ChallengeStatus,
  fetchGroupParticipations,
  type FetchGroupParticipationsParams,
} from '../../../../../entities/member/api/challenge/participate/get-group-participant-list'

import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

export const useInfiniteGroupParticipations = (status: ChallengeStatus) =>
  useInfiniteQuery<
    ApiResponse<ParticipantChallengeResponse>, // queryFn 반환 타입
    Error, // 에러 타입
    InfiniteData<ParticipantChallengeResponse>, // data 타입
    readonly [...typeof QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS, ChallengeStatus]
  >({
    queryKey: [...QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS, status] as const,

    queryFn: async ({ pageParam = {} }) => {
      // pageParam 타입은 Partial<FetchGroupParticipationsParams>
      const { cursorId, cursorTimestamp } = pageParam as FetchGroupParticipationsParams
      return fetchGroupParticipations({ status, cursorId, cursorTimestamp })
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

    initialPageParam: {}, // 첫 호출에서는 cursorId / cursorTimestamp 모두 undefined
    staleTime: 5 * 60 * 1000, // 5분
  })
