import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api'

import { GetGroupVerificationResultResponse } from './create-group-verification'

/** 인증 결과 조회 (롱폴링) */
export const getGroupVerificationResult = (challengeId: number) =>
  fetchRequest<GetGroupVerificationResultResponse>(ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.RESULT(challengeId))
