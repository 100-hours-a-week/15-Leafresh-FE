import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getMemberProfile } from '@features/member/api/profile/get-member-profile'
import { getMemberProfileCard } from '@features/member/api/profile/get-member-profilecard'
import Mypage from '@features/member/components/member/profile/mypage/Mypage'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'

const Page = async () => {
  const queryClient = getQueryClient()

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.MEMBER.DETAILS,
        queryFn: getMemberProfile,
        ...QUERY_KEYS.MEMBER.DETAILS,
      }),

      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.MEMBER.PROFILE_CARD,
        queryFn: getMemberProfileCard,
        ...QUERY_KEYS.MEMBER.PROFILE_CARD,
      }),
    ])

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <Mypage />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 데이터 프리패치 실패:', err)
    return <div>사용자 정보를 불러오는 데 실패했습니다.</div>
  }
}
export default Page
