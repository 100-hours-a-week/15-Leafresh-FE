import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'
import { ISOFormatString } from '@shared/types/date'

export type CommentResponse = {
  comments: CommentType[]
}

export type CommentType = {
  id: number
  content: string
  createdAt: ISOFormatString
  updatedAt: ISOFormatString
  nickname: string
  profileImageUrl: string
  parentCommentId: null
  isMine: boolean
  deleted: boolean
  replies?: RepliesType[]
}

export type RepliesType = {
  id: number
  content: string
  createdAt: ISOFormatString
  updatedAt: ISOFormatString
  nickname: string
  profileImageUrl: string
  parentCommentId: number
  isMine: boolean
  deleted: boolean
}

export const getVerificationCommentList = (challengeId: number, verificationId: number) => {
  return fetchRequest<CommentResponse>(ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.COMMENT.LIST(challengeId, verificationId))
}
