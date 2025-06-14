import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { useToast } from '@shared/hooks/useToast/useToast'
import { ApiResponse, ErrorResponse } from '@shared/lib/api/type'

import {
  PostGroupVerification,
  PostGroupVerificationBody,
  type PostGroupVerificationResponse,
} from '../../../../../entities/challenge/api/group/verification/create-group-verification'

import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { showNotification } from '@/libs/showNotification'

/** 인증 제출 뮤테이션 */
export const usePostGroupVerification = (challengeId: number) => {
  const openToast = useToast()

  const qc = useQueryClient()
  return useMutation<ApiResponse<PostGroupVerificationResponse>, ErrorResponse, PostGroupVerificationBody>({
    mutationKey: [MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.SUBMIT],
    mutationFn: body => PostGroupVerification({ challengeId, body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.RESULT(challengeId) })
    },
  })
}
