import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'

import { CommentResponse } from './get-verification-comment-list'

export type PostReplytBody = {
  comment: string
}

type PostReplyVariables = {
  challengeId: number
  verificationId: number
  commentId: number
  body: PostReplytBody
}

export const postVerificationReply = ({ challengeId, verificationId, commentId, body }: PostReplyVariables) => {
  return fetchRequest<CommentResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATIONS.COMMENT.REPLY(challengeId, verificationId, commentId),
    {
      body,
    },
  )
}
