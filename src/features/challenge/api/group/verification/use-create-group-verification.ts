import { useMutation } from '@tanstack/react-query'

import {
  PostGroupVerification,
  PostGroupVerificationBody,
  PostGroupVerificationResponse,
} from '@/entities/challenge/api'

import { getQueryClient, MUTATION_KEYS, QUERY_KEYS } from '@/shared/config'
import { ApiResponse, ErrorResponse } from '@/shared/lib'

/** 인증 제출 뮤테이션 */
export const usePostGroupVerification = (challengeId: number) => {
  const queryClient = getQueryClient()
  return useMutation<ApiResponse<PostGroupVerificationResponse>, ErrorResponse, PostGroupVerificationBody>({
    mutationKey: [MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.SUBMIT],
    mutationFn: body => PostGroupVerification({ challengeId, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.RESULT(challengeId) })
    },
  })
}
