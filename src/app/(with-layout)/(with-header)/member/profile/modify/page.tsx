import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getMemberProfile } from '@entities/member/api/profile/get-profile'
import { getQueryClient } from '@shared/config/tanstack-query/query-client'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import ProfileModifyPage from '../../../../../../widgets/member/profile/modify/ui/member-profile-modify'

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
