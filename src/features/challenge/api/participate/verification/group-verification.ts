import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

export type PostGroupVerificationBody = {
  imageUrl: string
  content: string | undefined
}

export type PostGroupVerificationResponse = {
  verificationId: number
  createdAt: string
}

type PostGroupVerificationVariables = {
  challengeId: number
  body: PostGroupVerificationBody
}

/** 단체 챌린지 인증 제출 */
export const PostGroupVerification = ({ challengeId, body }: PostGroupVerificationVariables) =>
  fetchRequest<PostGroupVerificationResponse>(ENDPOINTS.CHALLENGE.GROUP.VERIFY(challengeId), { body })

export type GetGroupVerificationResultResponse = {
  verificationId: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

/** 인증 결과 조회 (롱폴링) */
export const getGroupVerificationResult = (challengeId: number) =>
  fetchRequest<GetGroupVerificationResultResponse>(ENDPOINTS.CHALLENGE.GROUP.VERIFICATION_RESULT(challengeId))
