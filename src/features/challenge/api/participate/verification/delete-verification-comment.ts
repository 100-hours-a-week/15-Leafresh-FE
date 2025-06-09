import { fetchRequest } from '@shared/lib/api/fetcher'
import { CommentResponse } from './get-verification-comment-list'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

type DeleteReplyVariables = {
  challengeId: number
  verificationId: number
  commentId: number
}

export const deleteVerificationComment = ({ challengeId, verificationId, commentId }: DeleteReplyVariables) => {
  return fetchRequest<CommentResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATIONS.COMMENT.DELETE(challengeId, verificationId, commentId),
  )
}
