import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ApiResponse, ErrorResponse } from '@shared/lib/api/type'

import { getProducts, ProductsResponse } from '../../../entities/store/api/product/get-product-list'

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

export type Cursor = {
  cursorId?: number
  cursorTimestamp?: string
}

export const useInfiniteProducts = (input: string) => {
  return useInfiniteQuery<
    ApiResponse<ProductsResponse>, // 한 페이지당 반환되는 데이터 타입
    ErrorResponse, // 에러 타입
    InfiniteData<ApiResponse<ProductsResponse>>, // 최종 Data 타입
    ReturnType<typeof QUERY_KEYS.STORE.PRODUCTS.LIST>, // Query Key 타입
    Cursor
  >({
    queryKey: QUERY_KEYS.STORE.PRODUCTS.LIST(input),
    queryFn: ({ pageParam = {} }) => {
      const { cursorId, cursorTimestamp } = pageParam

      return getProducts({
        input,
        cursorId,
        cursorTimestamp,
      })
    },
    initialPageParam: {},
    getNextPageParam: last =>
      last.data.hasNext
        ? {
            cursorId: last.data.cursorInfo.lastCursorId,
            cursorTimestamp: last.data.cursorInfo.cursorTimestamp,
          }
        : undefined,
    ...QUERY_OPTIONS.STORE.PRODUCTS.LIST,
    enabled: false, // TODO: API 추가하면서 삭제 필요
  })
}
