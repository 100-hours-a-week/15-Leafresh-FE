import { notFound } from 'next/navigation'

import { getPersonalChallengeDetails } from '@/entities/challenge/api'
import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { ChallengePersonalDetails } from '@/widgets/challenge'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

interface PersonalChallengeDetailsProps {
  params: Promise<{ id: string }>
}

const PersonalChallengeDetails = async ({ params }: PersonalChallengeDetailsProps) => {
  const { id } = await params

  const idNumber = Number(id)
  if (isNaN(idNumber)) return notFound()

  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.DETAILS(idNumber),
      queryFn: () => getPersonalChallengeDetails(idNumber),
      ...QUERY_OPTIONS.CHALLENGE.PERSONAL.DETAILS,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <ChallengePersonalDetails challengeId={idNumber} />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 단체 챌린지 상세 데이터 로드 실패:', err)
    return <div>챌린지 상세 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default PersonalChallengeDetails
