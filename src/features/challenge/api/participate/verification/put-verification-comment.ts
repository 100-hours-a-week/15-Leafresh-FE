import { fetchRequest } from '@shared/lib/api/fetcher'
import { CommentResponse } from './get-verification-comment-list'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

export type PostCommentBody = {
  comment: string
}

type PutCommentVariables = {
  challengeId: number
  verificationId: number
  commentId: number
  body: PostCommentBody
}

export const putVerificationComment = ({ challengeId, verificationId, commentId, body }: PutCommentVariables) => {
  return fetchRequest<CommentResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATIONS.COMMENT.MODIFY(challengeId, verificationId, commentId),
    {
      body,
    },
  )
}
