import { useQuery } from '@tanstack/react-query'

import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import { PersonalChallengeVerificationResult } from '../../../entities/challenge/api/personal/verification/verify-personal'

type PollingQueryOptions = {
  enabled: boolean // 실행 가능 여부 (불필요한 요청을 막기 위해)
}

export const usePersonalChallengeVerificationResult = (
  challengeId: number,
  { enabled = false }: PollingQueryOptions,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.VERIFICATION.RESULT(challengeId),
    queryFn: () => PersonalChallengeVerificationResult(challengeId),
    ...QUERY_OPTIONS.CHALLENGE.PERSONAL.VERIFICATION_RESULT,
    enabled,
    refetchInterval: 5000, // 5초
    refetchIntervalInBackground: true,
  })
}
