// src/features/challenge/group/participate/hook/useGroupParticipationsCount.ts
import { useQuery } from '@tanstack/react-query'
import { fetchGroupParticipationsCount } from '../api/group-participant-count'
import { QUERY_KEYS } from '@shared/constants/tanstack-query/query-keys'
import type { ChallengeStatus } from '../api/group-participant'

export const useGroupParticipationsCount = (status: ChallengeStatus) =>
  useQuery<
    number, // TQueryFnData: queryFn이 반환하는 타입
    Error, // TError
    number, // TData: useQuery가 최종으로 반환할 data 타입
    readonly [...typeof QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS, 'count', ChallengeStatus] // TQueryKey
  >({
    queryKey: [...QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS, 'count', status] as const,
    queryFn: async () => {
      const res = await fetchGroupParticipationsCount({ status })
      return res.data
    },
    staleTime: 5 * 60 * 1000, // 5분간 fresh
  })
