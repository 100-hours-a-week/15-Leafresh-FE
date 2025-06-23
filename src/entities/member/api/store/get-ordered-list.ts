import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { InfiniteScrollResponse, ISOFormatString } from '@/shared/type'

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
