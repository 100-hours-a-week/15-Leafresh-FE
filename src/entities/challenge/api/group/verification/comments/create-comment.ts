import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'

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
