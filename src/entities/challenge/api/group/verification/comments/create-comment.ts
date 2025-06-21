import { ENDPOINTS, fetchRequest } from '@/shared/lib'

import { CommentResponse } from './get-comment-list'

export type PostCommentBody = {
  content: string
}

export type PostCommentVariables = {
  challengeId: number
  verificationId: number
  body: PostCommentBody
}

export const postVerificationComment = ({ challengeId, verificationId, body }: PostCommentVariables) => {
  return fetchRequest<CommentResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.COMMENT.CREATE(challengeId, verificationId),
    {
      body,
    },
  )
}
