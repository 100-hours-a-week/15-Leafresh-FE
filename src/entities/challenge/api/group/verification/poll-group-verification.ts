import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type GetGroupVerificationResultResponse = {
  verificationId: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

/** 인증 결과 조회 (롱폴링) */
export const getGroupVerificationResult = (challengeId: number) =>
  fetchRequest<GetGroupVerificationResultResponse>(ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.RESULT(challengeId))
