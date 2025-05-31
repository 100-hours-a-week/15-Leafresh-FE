import { dehydrate } from '@tanstack/react-query'

import { getProducts } from '@features/store/api/get-products'
import { getTimeDealProducts } from '@features/store/api/get-timedeals'
import StorePage from '@features/store/StorePage'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'

const Page = async () => {
  const queryClient = getQueryClient()

  try {
    await Promise.all([
      // 일반 상품 목록 조회
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.STORE.PRODUCTS.LIST(''), // 무한스크롤
        queryFn: getProducts,
        ...QUERY_OPTIONS.STORE.PRODUCTS,
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
