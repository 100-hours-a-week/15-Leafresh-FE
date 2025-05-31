import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ISOFormatString } from '@shared/types/date'

type TimeDealStatus = 'UPCOMING' | 'ONGOING'

export type TimeDealProduct = {
  dealId: number
  productId: number
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

export const getTimeDeals = () => {
  return fetchRequest<TimeDealProductsResponse>(ENDPOINTS.STORE.TIME_DEAL.LIST)
}
