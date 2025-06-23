import { ENDPOINTS, fetchRequest } from '@/shared/lib'

import { CommentResponse } from './get-comment-list'

export type PostReplyBody = {
  comment: string
}

export type PostReplyVariables = {
  challengeId: number
  verificationId: number
  commentId: number
  body: PostReplyBody
}

export const postVerificationReply = ({ challengeId, verificationId, commentId, body }: PostReplyVariables) => {
  return fetchRequest<CommentResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY(challengeId, verificationId, commentId),
    {
      body,
    },
  )
}
