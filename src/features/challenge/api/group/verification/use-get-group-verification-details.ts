import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import { getGroupVerifications } from '../../../../../entities/challenge/api/group/verification/get-group-verification-details'

import { useQuery } from '@tanstack/react-query'

/**
 * 단체 챌린지 인증 내역 조회 훅
 */
export const useGroupVerifications = (challengeId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS(challengeId),
    queryFn: () => getGroupVerifications(challengeId),
    ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS,
  })
