import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

export type PostGroupVerificationRequest = {
  imageUrl: string
  content: string | undefined
}

export type PostGroupVerificationResponse = ApiResponse<{
  verificationId: number
  createdAt: string
}>

export type GetGroupVerificationResultResponse = ApiResponse<{
  verificationId: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}>

/** 인증 제출 */
export const postGroupVerification = (
  challengeId: number,
  body: PostGroupVerificationRequest,
): Promise<PostGroupVerificationResponse> =>
  fetchRequest<PostGroupVerificationResponse>(ENDPOINTS.CHALLENGE.GROUP.VERIFY(challengeId), { body })

/** 인증 결과 조회 (롱폴링) */
export const getGroupVerificationResult = (challengeId: number): Promise<GetGroupVerificationResultResponse> =>
  fetchRequest<GetGroupVerificationResultResponse>(ENDPOINTS.CHALLENGE.GROUP.VERIFICATION_RESULT(challengeId))
