import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { ISOFormatString } from '@/shared/type'

export type TimeDealStatus = 'UPCOMING' | 'ONGOING'

export type TimeDealProduct = {
  dealId: number // 특가 상품 번호
  productId: number // 상품 번호
  title: string
  description: string
  defaultPrice: number
  discountedPrice: number
  discountedPercentage: number // 할인율
  stock: number
  imageUrl: string
  dealStartTime: ISOFormatString
  dealEndTime: ISOFormatString
  // productStatus: 'ACTIVE'
  timeDealStatus: TimeDealStatus
}

type TimeDealProductsResponse = {
  timeDeals: TimeDealProduct[]
}

export const getTimeDealProducts = () => {
  return fetchRequest<TimeDealProductsResponse>(ENDPOINTS.STORE.TIME_DEAL.LIST)
}
