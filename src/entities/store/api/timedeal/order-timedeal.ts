import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type OrderTimeDealProductResponse = {
  remainingLeaf: number
}

export type OrderTimeDealProductHeaders = {
  'Idempotency-Key': string
}

export type OrderTimeDealProductBody = {
  quantity: number
}

export type OrderTimeDealProductVariables = {
  productId: number
  headers: OrderTimeDealProductHeaders
  body: OrderTimeDealProductBody
}

/**
 * 일반 상품 구매
 */
export const OrderTimeDealProduct = ({ productId, headers, body }: OrderTimeDealProductVariables) => {
  return fetchRequest<OrderTimeDealProductResponse>(ENDPOINTS.STORE.TIME_DEAL.ORDER(productId), {
    body,
    headers,
  })
}
