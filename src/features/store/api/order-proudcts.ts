import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type OrderProductResponse = {
  remainingLeaf: number
}

export type OrderProductHeaders = {
  'Idempotency-Key': string
}

export type OrderProductBody = {
  quantity: number
}

export type OrderProductVariables = {
  productId: number
  headers: OrderProductHeaders
  body: OrderProductBody
}

/**
 * 일반 상품 구매
 */
export const OrderProduct = ({ productId, headers, body }: OrderProductVariables) => {
  return fetchRequest<OrderProductResponse>(ENDPOINTS.STORE.PRODUCTS.ORDER(productId), {
    body,
    headers,
  })
}
