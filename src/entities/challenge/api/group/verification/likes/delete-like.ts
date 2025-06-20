import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type DeleteVerificationLikeResponse = {
  isLiked: boolean
}

export type DeleteVerificationLikeVariables = {
  challengeId: number
  verificationId: number
}

/**
 * 인증 좋아요 추가 API
 */
export const DeleteVerificationLike = ({ challengeId, verificationId }: DeleteVerificationLikeVariables) => {
  return fetchRequest<DeleteVerificationLikeResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.LIKES.DELETE(challengeId, verificationId),
  )
}
