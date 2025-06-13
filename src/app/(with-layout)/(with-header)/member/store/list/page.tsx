import { getMemberStoreOrderList } from '@entities/member/api/store/get-ordered-list'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { MemberStoreOrderListPage } from '@widgets/member'

const Page = async () => {
  try {
    const queryClient = getQueryClient()
    await queryClient.prefetchInfiniteQuery({
      queryKey: QUERY_KEYS.MEMBER.STORE.ORDERS.LIST,
      queryFn: ({ pageParam = undefined }) => getMemberStoreOrderList(pageParam ?? {}),
      initialPageParam: undefined,
      ...QUERY_OPTIONS.MEMBER.STORE.ORDERS.LIST,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <MemberStoreOrderListPage />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 구매한 상품 목록 데이터 로드 실패:', err)
    return <div>구매한 상품 목록 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default Page
