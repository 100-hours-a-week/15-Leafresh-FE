import { CommentResponse } from './get-comment-list'

import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type PostReplytBody = {
  content: string
}

export type PostReplyVariables = {
  challengeId: number
  verificationId: number
  commentId: number
  body: PostReplytBody
}

export const postVerificationReply = ({ challengeId, verificationId, commentId, body }: PostReplyVariables) => {
  return fetchRequest<CommentResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY(challengeId, verificationId, commentId),
    {
      body,
    },
  )
}
