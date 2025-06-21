import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  PostGroupVerification,
  PostGroupVerificationBody,
  PostGroupVerificationResponse,
} from '@/entities/challenge/api'

import { MUTATION_KEYS, QUERY_KEYS } from '@/shared/config'
import { ApiResponse, ErrorResponse } from '@/shared/lib'

/** 인증 제출 뮤테이션 */
export const usePostGroupVerification = (challengeId: number) => {
  const qc = useQueryClient()
  return useMutation<ApiResponse<PostGroupVerificationResponse>, ErrorResponse, PostGroupVerificationBody>({
    mutationKey: [MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.SUBMIT],
    mutationFn: body => PostGroupVerification({ challengeId, body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.RESULT(challengeId) })
    },
  })
}
