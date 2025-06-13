// src/features/challenge/group/participate/hook/useGroupParticipationsCount.ts
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import { fetchGroupParticipationsCount } from '../../../entities/challenge/api/participate/group-participant-count'

import { useQuery } from '@tanstack/react-query'

export interface CountObj {
  notStarted: number
  ongoing: number
  completed: number
}

export const useGroupParticipationsCount = () =>
  useQuery({
    queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.COUNT,
    queryFn: fetchGroupParticipationsCount, // no status param
    ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.COUNT,
  })
