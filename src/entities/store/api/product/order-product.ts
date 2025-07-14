import { ENDPOINTS, fetchRequest } from '@/shared/lib'

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
