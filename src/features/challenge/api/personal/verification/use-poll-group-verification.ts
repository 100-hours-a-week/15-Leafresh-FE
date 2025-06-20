import { PersonalChallengeVerificationResult } from '@/entities/challenge/api'
import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { useQuery } from '@tanstack/react-query'

type PollingQueryOptions = {
  enabled: boolean // 실행 가능 여부 (불필요한 요청을 막기 위해)
}

// 롱폴링
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
