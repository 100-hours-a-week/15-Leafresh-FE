import { getProducts, getTimeDealProducts, ProductsResponse } from '@entities/store/api'
import { Cursor } from '@features/store/api/use-get-product-list'
import { getQueryClient } from '@shared/config/tanstack-query/query-client'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ApiResponse } from '@shared/lib/api/type'

import { dehydrate } from '@tanstack/react-query'
import { StorePage } from '@widgets/store'

const Page = async () => {
  const queryClient = getQueryClient()

  try {
    await Promise.all([
      // 일반 상품 목록 조회
      queryClient.prefetchInfiniteQuery({
        queryKey: QUERY_KEYS.STORE.PRODUCTS.LIST(''), // 공백은 전체 검색
        queryFn: ({ pageParam = {} }: { pageParam: Cursor }) => {
          const { cursorId, cursorTimestamp } = pageParam
          return getProducts({ input: '', cursorId, cursorTimestamp }) // input은 없다.
        },
        initialPageParam: {},
        getNextPageParam: (last: ApiResponse<ProductsResponse>) => {
          return last.data.hasNext
            ? {
                cursorId: last.data.cursorInfo.lastCursorId,
                cursorTimestamp: last.data.cursorInfo.cursorTimestamp,
              }
            : undefined
        },
        ...QUERY_OPTIONS.STORE.PRODUCTS.LIST,
      }),

      // 특가 상품 목록 조회
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.STORE.TIME_DEAL.LIST,
        queryFn: getTimeDealProducts,
        ...QUERY_OPTIONS.STORE.TIME_DEAL,
      }),
    ])

    const dehydratedState = dehydrate(queryClient)

    return (
      // <HydrationBoundary state={dehydratedState}>
      <StorePage />
      // </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 상세 데이터 로드 실패:', err)
    return <div>챌린지 상세 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default Page
