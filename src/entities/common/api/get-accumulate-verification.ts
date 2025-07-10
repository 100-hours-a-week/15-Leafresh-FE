import { ENDPOINTS, fetchRequest } from '@/shared/lib'

type VerificationAccumulateCountResponse = {
  count: number
}

export const getVerificationAccumulateCount = () => {
  return fetchRequest<VerificationAccumulateCountResponse>(ENDPOINTS.CHALLENGE.ETC.COUNT.VERIFICATION)
}
