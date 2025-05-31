import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { InfiniteScrollResponse } from '@shared/types/api'

export type Product = {
  id: number
  title: string
  description: string
  imageUrl: string
  price: number
  stock: number
  // "status": "AVAILABLE"
}

type ProductsResponse = InfiniteScrollResponse<{ products: Product[] }>

export const getProducts = () => {
  return fetchRequest<ProductsResponse>(ENDPOINTS.STORE.PRODUCTS.LIST)
}
