import { notFound } from 'next/navigation'

import { getGroupChallengeDetails } from '@/entities/challenge/api'
import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { ChallengeGroupModifyPage } from '@/widgets/challenge'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

interface GroupChallengeModifyPageProps {
  params: Promise<{ id: string }>
}

const GroupChallengeModifyPage = async ({ params }: GroupChallengeModifyPageProps) => {
  const { id } = await params
  const challengeId = Number(id)
  if (isNaN(challengeId)) return notFound()

  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId),
      queryFn: () => getGroupChallengeDetails(challengeId),
      ...QUERY_OPTIONS.CHALLENGE.GROUP.DETAILS,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <ChallengeGroupModifyPage challengeId={challengeId} />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 단체 챌린지 상세 프리패치 실패:', err)
    return <div>단체 챌린지 상세 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default GroupChallengeModifyPage
