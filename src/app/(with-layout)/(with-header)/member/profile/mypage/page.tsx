import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { Mypage } from '@/widgets/member'

import { getMemberProfile, getMemberProfileCard } from '@/entities/member/api'

import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

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
