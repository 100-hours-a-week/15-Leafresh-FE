import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { ProfileModifyPage } from '@/widgets/member'

import { getMemberProfile } from '@/entities/member/api'

import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

const Page = async () => {
  const queryClient = getQueryClient()
  try {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.MEMBER.DETAILS,
      queryFn: getMemberProfile,
      ...QUERY_OPTIONS.MEMBER.DETAILS,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <ProfileModifyPage />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 데이터 프리패치 실패:', err)
    return <div>사용자 정보를 불러오는 데 실패했습니다.</div>
  }
}
export default Page
