import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { MemberChallengeCreationsPage } from '@/widgets/member'

import { MemberGroupChallengeCreations } from '@/entities/member/api'

import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

const Page = async () => {
  try {
    const queryClient = getQueryClient()
    await queryClient.prefetchInfiniteQuery({
      queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.CREATIONS,
      queryFn: ({ pageParam = undefined }) => MemberGroupChallengeCreations(pageParam ?? {}),
      initialPageParam: undefined,
      ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.CREATIONS,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <MemberChallengeCreationsPage />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 생성한 단체 챌린지 데이터 로드 실패:', err)
    return <div>생성한 단체 챌린지 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default Page
