import { ENDPOINTS, fetchRequest } from '@/shared/lib'

import { RepliesType } from './get-comment-list'

export type PostReplyBody = {
  content: string
}

export type PostReplyVariables = {
  challengeId: number
  verificationId: number
  commentId: number
  body: PostReplyBody
}

export const postVerificationReply = ({ challengeId, verificationId, commentId, body }: PostReplyVariables) => {
  return fetchRequest<RepliesType>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY(challengeId, verificationId, commentId),
    {
      body,
    },
  )
}
