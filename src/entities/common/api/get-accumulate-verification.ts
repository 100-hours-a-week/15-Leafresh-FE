import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

type VerificationAccumulateCountResponse = {
  count: number
}

export const getVerificationAccumulateCount = () => {
  return fetchRequest<VerificationAccumulateCountResponse>(ENDPOINTS.CHALLENGE.ETC.COUNT.VERIFICATION)
}
