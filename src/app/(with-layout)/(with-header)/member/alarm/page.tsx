import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { MemberAlarmList } from '@/widgets/member'

import { getChallengeAlarmList } from '@/entities/challenge/api'

import { getQueryClient, QUERY_KEYS } from '@/shared/config'

const MemberAlarmPage = async () => {
  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: QUERY_KEYS.MEMBER.NOTIFICATION.LIST,
      queryFn: ({ pageParam = {} }) => getChallengeAlarmList({ ...pageParam }),
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
