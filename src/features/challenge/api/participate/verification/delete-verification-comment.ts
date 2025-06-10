import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'

export type DeleteCommentVariables = {
  challengeId: number
  verificationId: number
  commentId: number
}

export const deleteVerificationComment = ({ challengeId, verificationId, commentId }: DeleteCommentVariables) => {
  return fetchRequest(ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.COMMENT.DELETE(challengeId, verificationId, commentId))
}
