// src/features/member/hooks/useFeedbackPolling.ts
import { useQuery } from '@tanstack/react-query'

import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import { getFeedbackResult } from '../api/profile/get-member-feedback-result'

type PollingQueryOptions = {
  enabled: boolean
}

export const useFeedbackPolling = ({ enabled = false }: PollingQueryOptions) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBER.FEEDBACK.GET_FEEDBACK,
    queryFn: () => getFeedbackResult(),
    ...QUERY_OPTIONS.MEMBER.FEEDBACK,
    enabled,
    refetchInterval: 3000, // 3초마다
    refetchIntervalInBackground: true,
  })
}
