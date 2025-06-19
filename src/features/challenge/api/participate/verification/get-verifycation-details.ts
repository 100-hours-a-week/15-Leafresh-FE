import { ChallengeCategoryType, FeedVerificationStatusType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'
import { ISOFormatString } from '@shared/type/date'

export type VerificationDetailResponse = {
  id: number
  nickname: string
  profileImageUrl: string
  isLiked: boolean // 로그인한 사용자의 좋아요 여부. 로그인하지 않은 사용자는 false 고정
  imageUrl: string // 인증 이미지
  content: string // 인증 텍스트
  category: ChallengeCategoryType
  status: FeedVerificationStatusType // SUCCESS, FAILURE, PENDING_APPROVAL
  verifiedAt: ISOFormatString | null // AI 인증 완료 시각 (null 허용)
  counts: {
    view: number
    like: number
    comment: number
  }
  createdAt: ISOFormatString
  updatedAt: ISOFormatString
}

export type VerificationDetailVariables = {
  challengeId: number
  verificationId: number
}

export const getVerificationDetails = ({ challengeId, verificationId }: VerificationDetailVariables) => {
  return fetchRequest<VerificationDetailResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.DETAILS(challengeId, verificationId),
  )
}
