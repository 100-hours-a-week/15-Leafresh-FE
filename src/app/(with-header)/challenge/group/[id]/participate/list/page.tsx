import { notFound } from 'next/navigation'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getGroupChallengeParticipateList } from '@features/challenge/api/participate/get-group-participant-list'
import ChallengeGroupParticipateList from '@features/challenge/components/challenge/participate/list/ChallengeGroupParticipateList'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'

interface GroupChallengeParticipateListPageProps {
  params: Promise<{ id: string }>
}

const GroupChallengeParticipateListPage = async ({ params }: GroupChallengeParticipateListPageProps) => {
  const { id } = await params
  const idNumber = Number(id)
  if (isNaN(idNumber)) return notFound()

  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATIONS(idNumber),
      queryFn: ({ pageParam = {} }) =>
        getGroupChallengeParticipateList({
          challengeId: idNumber,
          ...pageParam,
        }),
      initialPageParam: {},
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <ChallengeGroupParticipateList challengeId={idNumber} />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 인증 리스트 프리패치 실패:', err)
    return <div>챌린지 인증 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default GroupChallengeParticipateListPage
