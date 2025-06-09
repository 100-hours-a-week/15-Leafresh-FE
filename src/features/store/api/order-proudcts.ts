import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type OrderProductResponse = {
  remainingLeaf: number
}

export type OrderProductVariables = {
  productId: number
}

/**
 * 일반 상품 구매
 */
export const OrderProduct = ({ productId }: OrderProductVariables) => {
  return fetchRequest<OrderProductResponse>(ENDPOINTS.STORE.PRODUCTS.ORDER(productId))
}
