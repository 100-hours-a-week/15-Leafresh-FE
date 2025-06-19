import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getMemberProfile } from '@entities/member/api/profile/get-profile'
import { getMemberProfileCard } from '@entities/member/api/profile/get-profilecard'
import { getQueryClient } from '@shared/config/tanstack-query/query-client'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import Mypage from '../../../../../../widgets/member/profile/mypage/ui/member-profile-mypage'

const Page = async () => {
  const queryClient = getQueryClient()

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.MEMBER.DETAILS,
        queryFn: getMemberProfile,
        ...QUERY_OPTIONS.MEMBER.DETAILS,
      }),

      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.MEMBER.PROFILE_CARD,
        queryFn: getMemberProfileCard,
        ...QUERY_OPTIONS.MEMBER.PROFILE_CARD,
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
