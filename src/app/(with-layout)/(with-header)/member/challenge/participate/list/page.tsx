import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { ChallengeStatus, getGroupParticipations } from '@features/challenge/api/participate/group-participant'
import { getGroupParticipationsCount } from '@features/challenge/api/participate/group-participant-count'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'

import ChallengeParticipatePage from '../../../../../../../widgets/member/challenge/participate/list/ui/member-challenge-participate-list'

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
