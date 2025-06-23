import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { MemberOrderListPage } from '@/widgets/member'

import { getMemberStoreOrderList } from '@/entities/member/api'

import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

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
