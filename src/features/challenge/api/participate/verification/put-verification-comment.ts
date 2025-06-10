import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'

import { CommentResponse } from './get-verification-comment-list'

export type PostCommentBody = {
  comment: string
}

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
