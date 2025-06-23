// src/features/member/hooks/useFeedbackPolling.ts
import { useQuery } from '@tanstack/react-query'

import { getFeedbackResult } from '@/entities/member/api'

import { QUERY_OPTIONS, QUERY_KEYS } from '@/shared/config'

type PollingQueryOptions = {
  enabled: boolean
}

export const useFeedbackPolling = ({ enabled = false }: PollingQueryOptions) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBER.FEEDBACK.RESULT,
    queryFn: () => getFeedbackResult(),
    ...QUERY_OPTIONS.MEMBER.FEEDBACK.RESULT,
    enabled,
    refetchInterval: 3000, // 3초마다
    refetchIntervalInBackground: true,
  })
}
