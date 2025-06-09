import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'

import { CommentResponse } from './get-verification-comment-list'

export type PostCommentBody = {
  comment: string
}

type PostCommentVariables = {
  challengeId: number
  verificationId: number
  body: PostCommentBody
}

export const postVerificationComment = ({ challengeId, verificationId, body }: PostCommentVariables) => {
  return fetchRequest<CommentResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATIONS.COMMENT.CREATE(challengeId, verificationId),
    {
      body,
    },
  )
}
