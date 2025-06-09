import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'

export type CommentResponse = {
  comment: {
    id: number
    content: string
    createdAt: string
    updatedAt: string
    nickname: string
    profileImageUrl: string
    parentCommentId: null
    isMine: boolean
    deleted: boolean
    replies?: RepliesType[]
  }[]
}

export type RepliesType = {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  nickname: string
  profileImageUrl: string
  parentCommentId: number
  isMine: boolean
  deleted: boolean
}

export const getVerificationCommemtList = (challengeId: number, verificationId: number) => {
  return fetchRequest<CommentResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATIONS.COMMENT.LIST(challengeId, verificationId),
  )
}
