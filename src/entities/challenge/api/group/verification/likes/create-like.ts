import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type CreateVerificationLikeResponse = {
  isLiked: boolean
}

export type CreateVerificationLikeVariables = {
  challengeId: number
  verificationId: number
}

/**
 * 인증 좋아요 추가 API
 */
export const CreateVerificationLike = ({ challengeId, verificationId }: CreateVerificationLikeVariables) => {
  return fetchRequest<CreateVerificationLikeResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.LIKES.CREATE(challengeId, verificationId),
  )
}
