import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { getMemberStoreOrderList, MemberStoreOrderListResponse } from '@/entities/member/api'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { ApiResponse } from '@/shared/lib'

export const useInfiniteMemberStoreOrderList = () => {
  return useInfiniteQuery<
    ApiResponse<MemberStoreOrderListResponse>, // fetch 반환 타입
    Error,
    InfiniteData<ApiResponse<MemberStoreOrderListResponse>>,
    typeof QUERY_KEYS.MEMBER.STORE.ORDERS.LIST
  >({
    queryKey: QUERY_KEYS.MEMBER.STORE.ORDERS.LIST,
    queryFn: async ({ pageParam = undefined }) => getMemberStoreOrderList(pageParam ?? {}),
    ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.CREATIONS,
    initialPageParam: undefined,

    getNextPageParam: lastPage => {
      const { hasNext, cursorInfo } = lastPage.data
      return hasNext
        ? {
            cursorId: cursorInfo.lastCursorId,
            cursorTimestamp: cursorInfo.cursorTimestamp,
          }
        : undefined
    },
  })
}
