import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

type LeafAccumulateCountResponse = {
  count: number
}

export const getLeafAccumulateCount = () => {
  return fetchRequest<LeafAccumulateCountResponse>(ENDPOINTS.STORE.ETC.COUNT.LEAVES)
}
