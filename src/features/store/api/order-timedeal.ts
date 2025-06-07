import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type OrderTimeDealProductResponse = {
  remainingLeaf: number
}

export type OrderTimeDealProductBody = {
  quantity: number
}

export type OrderTimeDealProductVariables = {
  productId: number
  body: OrderTimeDealProductBody
}

/**
 * 일반 상품 구매
 */
export const OrderTimeDealProduct = ({ productId, body }: OrderTimeDealProductVariables) => {
  return fetchRequest<OrderTimeDealProductResponse>(ENDPOINTS.STORE.TIME_DEAL.ORDER(productId), {
    body,
  })
}
