import { notFound } from 'next/navigation'

import ChallengePersonalDetails from '@features/challenge/components/challenge/personal/details/ChallengePersonalDetails'
// import { getPersonalChallengeDetails } from '@features/challenge/api/get-personal-challenge-details'
// import { QUERY_KEYS } from '@shared/constants/tanstack-query/query-keys'
// import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
// import ChallengePersonalDetails from '@features/challenge/components/challenge/personal/details/ChallengePersonalDetails'

interface PersonalChallengeDetailsProps {
  params: { id: string }
}

const PersonalChallengeDetails = async ({ params }: PersonalChallengeDetailsProps) => {
  const { id } = await params

  const idNumber = Number(id)
  if (isNaN(idNumber)) return notFound()

  // const queryClient = getQueryClient()

  return <ChallengePersonalDetails challengeId={idNumber} />

  // try {
  //   await queryClient.prefetchQuery({
  //     queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.DETAILS(id),
  //     queryFn: () => getPersonalChallengeDetails(id),
  //   })

  //   const dehydratedState = dehydrate(queryClient)

  //   return (
  //     <HydrationBoundary state={dehydratedState}>
  //       <ChallengePersonalDetails challengeId={id} />
  //     </HydrationBoundary>
  //   )
  // } catch (err) {
  //   console.error('[SSR] 단체 챌린지 상세 데이터 로드 실패:', err)
  //   return <div>챌린지 상세 정보를 불러오는 데 실패했습니다.</div>
  // }
}

export default PersonalChallengeDetails
