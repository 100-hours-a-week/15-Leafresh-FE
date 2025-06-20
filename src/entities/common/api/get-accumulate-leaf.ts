import { ENDPOINTS, fetchRequest } from '@/shared/lib'

type LeafAccumulateCountResponse = {
  count: number
}

export const getLeafAccumulateCount = () => {
  return fetchRequest<LeafAccumulateCountResponse>(ENDPOINTS.STORE.ETC.COUNT.LEAVES)
}
