import { notFound } from 'next/navigation'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { ChallengeGroupParticipateList } from '@/widgets/challenge'

import { getGroupChallengeDetails, getGroupChallengeParticipateList } from '@/entities/challenge/api'

import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

interface GroupChallengePageProps {
  params: Promise<{ id: string }>
}

const GroupChallengePage = async ({ params }: GroupChallengePageProps) => {
  const { id } = await params
  const idNumber = Number(id)
  if (isNaN(idNumber)) return notFound()

  const queryClient = getQueryClient()

  try {
    /** ✅ 1. 챌린지 상세 정보 prefetch */
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(idNumber),
      queryFn: () => getGroupChallengeDetails(idNumber),
      ...QUERY_OPTIONS.CHALLENGE.GROUP.DETAILS,
    })

    /** ✅ 2. 챌린지 인증 리스트 prefetch (무한 스크롤) */
    await queryClient.prefetchInfiniteQuery({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.LIST(idNumber),
      queryFn: ({ pageParam = {} }) =>
        getGroupChallengeParticipateList({
          challengeId: idNumber,
          ...pageParam,
        }),
      initialPageParam: {},
      ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.LIST,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <ChallengeGroupParticipateList challengeId={idNumber} />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 데이터 프리패치 실패:', err)
    return <div>챌린지 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default GroupChallengePage
