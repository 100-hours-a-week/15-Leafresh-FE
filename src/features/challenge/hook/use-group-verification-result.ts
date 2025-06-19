import { useQuery } from '@tanstack/react-query'

import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import { getGroupVerificationResult } from '../../../entities/challenge/api/group/verification/create-group-verification'

type PollingQueryOptions = {
  enabled: boolean // 실행 가능 여부 (불필요한 요청을 막기 위해)
}

/** 인증 결과 롱폴링 훅 */
export const useGroupChallengeVerificationResult = (challengeId: number, { enabled = false }: PollingQueryOptions) => {
  return useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.RESULT(challengeId),
    queryFn: () => getGroupVerificationResult(challengeId),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.RESULT,
    enabled,
    refetchInterval: 5000, // 5초
    refetchIntervalInBackground: true,
  })
}
