import { ChallengeCategoryType, ChallengeVerificationResultType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'
import { DateFormatString } from '@shared/types/date'

export type VerificationDetailResponse = {
  id: 0
  nickname: string
  profileImageUrl: string
  isLiked: boolean // 로그인한 사용자의 좋아요 여부. 로그인하지 않은 사용자는 false 고정
  imageUrl: string // 인증 이미지
  content: string // 인증 텍스트
  category: ChallengeCategoryType
  status: ChallengeVerificationResultType // SUCCESS, FAILURE, PENDING_APPROVAL
  verifiedAt: DateFormatString | null // AI 인증 완료 시각 (null 허용)
  counts: {
    view: number
    like: number
    comment: number
  }
  createdAt: DateFormatString
  updatedAt: DateFormatString
}

export const getVerificationDetails = (challengeId: number, verificationId: number) => {
  return fetchRequest<VerificationDetailResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATIONS.DETAILS(challengeId, verificationId),
  )
}
