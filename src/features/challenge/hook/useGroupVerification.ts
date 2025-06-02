import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { useToast } from '@shared/hooks/useToast/useToast'
import { ApiResponse, ErrorResponse } from '@shared/lib/api/fetcher/type'

import {
  getGroupVerificationResult,
  PostGroupVerification,
  PostGroupVerificationBody,
  type PostGroupVerificationResponse,
} from '../api/participate/verification/group-verification'
// import { showNotification } from '@/libs/showNotification'

/** 인증 제출 뮤테이션 */
export const usePostGroupVerification = (challengeId: number) => {
  const openToast = useToast()

  const qc = useQueryClient()
  return useMutation<ApiResponse<PostGroupVerificationResponse>, ErrorResponse, PostGroupVerificationBody>({
    mutationKey: [MUTATION_KEYS.CHALLENGE.GROUP.VERIFY],
    mutationFn: body => PostGroupVerification({ challengeId, body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION_RESULT(challengeId) })
    },
  })
}

/** 인증 결과 롱폴링 훅 */
export const useGroupVerificationResult = (challengeId: number) => {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION_RESULT(challengeId),
    queryFn: () => getGroupVerificationResult(challengeId),
    refetchInterval: query => {
      const data = query.state.data
      return data && data.data.status === 'PENDING' ? 3000 : false
    },
    refetchOnWindowFocus: false,
    retry: false,
    ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION_RESULT,
  })

  useEffect(() => {
    if (query.data && query.data.data.status !== 'PENDING') {
      // PWA 알림: 2차 기간에 적용
      // const msg = query.data.data.status === 'APPROVED'
      //   ? '단체 챌린지 인증 승인되었습니다!'
      //   : '단체 챌린지 인증 거절되었습니다.'
      // showNotification(msg, `/challenges/group/${challengeId}`)

      // 관련 쿼리 무효화
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS(challengeId) })

      // 폴링 중지
      qc.setQueryDefaults(QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION_RESULT(challengeId), {
        refetchInterval: undefined,
      })
    }
  }, [query.data, qc, challengeId, query])

  return query
}
