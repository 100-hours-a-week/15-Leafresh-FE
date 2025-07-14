import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { ChallengeParticipatePage } from '@/widgets/member'

import { ChallengeStatus, getGroupParticipations, getGroupParticipationsCount } from '@/entities/member/api'

import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

export default async function Page() {
  try {
    const status: ChallengeStatus = 'ongoing'

    const queryClient = getQueryClient()

    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.COUNT,
        queryFn: getGroupParticipationsCount,
        ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.COUNT,
      }),

      queryClient.prefetchInfiniteQuery({
        queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS(status),
        queryFn: async ({ pageParam = {} }) => getGroupParticipations({ status, ...pageParam }),
        initialPageParam: {},
        ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS,
      }),
    ])

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <ChallengeParticipatePage />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 데이터 프리패치 실패:', err)
    return <div>챌린지 정보를 불러오는 데 실패했습니다.</div>
  }
}
