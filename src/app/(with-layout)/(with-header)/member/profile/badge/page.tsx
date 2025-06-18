import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getBadgeList } from '@features/member/api/profile/get-badge'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'

import BadgePage from '../../../../../../widgets/member/profile/badge-list/ui/member-badge-list'

const Page = async () => {
  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.MEMBER.BADGES.LIST,
      queryFn: getBadgeList,
      ...QUERY_OPTIONS.MEMBER.BADGES.LIST,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <BadgePage />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 데이터 프리패치 실패:', err)
    return <div>뱃지 정보를 불러오는 데 실패했습니다.</div>
  }
}
export default Page
