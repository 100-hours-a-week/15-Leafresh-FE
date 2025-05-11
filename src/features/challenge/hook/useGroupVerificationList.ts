import { useQuery } from '@tanstack/react-query'
import {
  getGroupVerifications,
  GetGroupVerificationsResponse,
} from '../api/participate/verification/group-verification-list'
import { QUERY_KEYS } from '@shared/constants/tanstack-query/query-keys'

/**
 * 단체 챌린지 인증 내역 조회 훅
 */
export const useGroupVerifications = (challengeId: number) =>
  useQuery<GetGroupVerificationsResponse, Error>({
    queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS(challengeId),
    queryFn: () => getGroupVerifications(challengeId),
    staleTime: 1000 * 60 * 5,
  })
