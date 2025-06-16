import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import { getGroupVerificationResult } from '../api/participate/verification/group-verification'
// import { showNotification } from '@/libs/showNotification'

/** 인증 결과 롱폴링 훅 */
export const useGroupVerificationResult = (challengeId: number) => {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.RESULT(challengeId),
    queryFn: () => getGroupVerificationResult(challengeId),
    refetchInterval: query => {
      const data = query.state.data
      return data && data.data.status === 'PENDING' ? 3000 : false
    },
    refetchOnWindowFocus: false,
    retry: false,
    ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.RESULT,
  })

  useEffect(() => {
    if (query.data && query.data.data.status !== 'PENDING') {
      // PWA 알림: 2차 기간에 적용
      // const msg = query.data.data.status === 'APPROVED'
      //   ? '단체 챌린지 인증 승인되었습니다!'
      //   : '단체 챌린지 인증 거절되었습니다.'
      // showNotification(msg, `/challenges/group/${challengeId}`)

      // 관련 쿼리 무효화
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS('completed') })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS(challengeId) })

      // 폴링 중지
      qc.setQueryDefaults(QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.RESULT(challengeId), {
        refetchInterval: undefined,
      })
    }
  }, [query.data, qc, challengeId, query])

  return query
}
