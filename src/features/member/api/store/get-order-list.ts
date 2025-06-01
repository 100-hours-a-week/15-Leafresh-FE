import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { InfiniteScrollResponse } from '@shared/types/api'
import { ISOFormatString } from '@shared/types/date'

export type MemberStoreOrderListParams = {
  cursorId?: number
  cursorTimestamp?: ISOFormatString
}

export type PurchaseProduct = {
  id: number
  product: {
    id: number
    title: string
    imageUrl: string
  }
  quantity: number
  price: number
  purchasedAt: ISOFormatString
}

export type MemberStoreOrderListResponse = InfiniteScrollResponse<{
  purchases: PurchaseProduct[]
}>

export const getMemberStoreOrderList = ({ cursorId, cursorTimestamp }: MemberStoreOrderListParams) => {
  return fetchRequest<MemberStoreOrderListResponse>(ENDPOINTS.MEMBERS.STORE.ORDERS.LIST, {
    query: {
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
