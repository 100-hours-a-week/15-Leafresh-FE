// src/features/challenge/group/participate/hook/useGroupParticipationsCount.ts
import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import { fetchGroupParticipationsCount } from '../api/participate/group-participant-count'

export interface CountObj {
  notStarted: number
  ongoing: number
  completed: number
}

export const useGroupParticipationsCount = () =>
  useQuery<CountObj, Error>({
    queryKey: [...QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS, 'count'] as const,
    queryFn: async () => {
      const res = await fetchGroupParticipationsCount() // no status param
      return res.data.count
    },
    staleTime: 5 * 60 * 1000,
  })
