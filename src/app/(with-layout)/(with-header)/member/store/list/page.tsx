import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getMemberStoreOrderList } from '@features/member/api/store/get-order-list'
import { getQueryClient } from '@shared/config/tanstack-query/query-client'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import MemberOrderListPage from '../../../../../../widgets/member/store/list/ui/member-store-order-list'

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
        <MemberOrderListPage />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 구매한 상품 목록 데이터 로드 실패:', err)
    return <div>구매한 상품 목록 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default Page
