import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type OrderTimeDealProductResponse = {
  remainingLeaf: number
}

export type OrderTimeDealProductVariables = {
  productId: number
}

/**
 * 일반 상품 구매
 */
export const OrderTimeDealProduct = ({ productId }: OrderTimeDealProductVariables) => {
  return fetchRequest<OrderTimeDealProductResponse>(ENDPOINTS.STORE.TIME_DEAL.ORDER(productId))
}
