// src/app/(with-header)/member/alarm/page.tsx

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import MemberAlarmList from '@features/challenge/components/member/alarm/MemberAlramList'
import { getMemberAlarmList } from '@features/member/api/get-alarm'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'
import { QUERY_KEYS } from '@shared/constants/tanstack-query/query-keys'

const MemberAlarmPage = async () => {
  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: QUERY_KEYS.MEMBER.NOTIFICATION.LIST,
      queryFn: ({ pageParam = {} }) => getMemberAlarmList(pageParam),
      initialPageParam: {},
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <MemberAlarmList />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 알림 리스트 프리패치 실패:', err)
    return <div>알림 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default MemberAlarmPage
