import { notFound } from 'next/navigation'

import { getGroupChallengeDetails } from '@/entities/challenge/api'
import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { ChallengeGroupDetails } from '@/widgets/challenge'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

interface GroupChallengeDetailsPageProps {
  params: Promise<{ id: string }>
}

const GroupChallengeDetailsPage = async ({ params }: GroupChallengeDetailsPageProps) => {
  const { id } = await params

  const idNumber = Number(id)
  if (isNaN(idNumber)) return notFound()

  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(idNumber),
      queryFn: () => getGroupChallengeDetails(idNumber),
      ...QUERY_OPTIONS.CHALLENGE.GROUP.DETAILS,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <ChallengeGroupDetails challengeId={idNumber} />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 상세 데이터 로드 실패:', err)
    return <div>챌린지 상세 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default GroupChallengeDetailsPage
