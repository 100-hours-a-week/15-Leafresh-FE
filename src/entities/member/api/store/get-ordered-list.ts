import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { InfiniteScrollResponse } from '@shared/type/api'
import { ISOFormatString } from '@shared/type/date'

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
  quantity: number // 구매 개수
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
