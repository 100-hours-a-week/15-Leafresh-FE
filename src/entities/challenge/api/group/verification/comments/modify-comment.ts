import { ENDPOINTS, fetchRequest } from '@/shared/lib'

import { PostCommentBody } from './create-comment'
import { CommentResponse } from './get-comment-list'

export type PutCommentVariables = {
  challengeId: number
  verificationId: number
  commentId: number
  body: PostCommentBody
}

export const putVerificationComment = ({ challengeId, verificationId, commentId, body }: PutCommentVariables) => {
  return fetchRequest<CommentResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.COMMENT.MODIFY(challengeId, verificationId, commentId),
    {
      body,
    },
  )
}
