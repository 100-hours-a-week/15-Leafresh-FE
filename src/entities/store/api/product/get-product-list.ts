import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { InfiniteScrollResponse } from '@shared/type/api'

export interface ProductListParams {
  input: string
  cursorId?: number
  cursorTimestamp?: string
}

export type Product = {
  id: number
  title: string
  description: string
  imageUrl: string
  price: number
  stock: number
  // "status": "AVAILABLE"
}

export type ProductsResponse = InfiniteScrollResponse<{ products: Product[] }>

export const getProducts = ({ input, cursorId, cursorTimestamp }: ProductListParams) => {
  // query 객체에 undefined 값은 제외하고 문자열/숫자 타입으로만 전환
  const query: Record<string, string | number> = {}
  if (input) query.input = input
  if (cursorId !== undefined) query.cursorId = cursorId
  if (cursorTimestamp) query.cursorTimestamp = cursorTimestamp
  return fetchRequest<ProductsResponse>(ENDPOINTS.STORE.PRODUCTS.LIST, { query })
}
