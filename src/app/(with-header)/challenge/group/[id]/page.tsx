import { notFound } from 'next/navigation'

import ChallengeGroupDetails from '@features/challenge/components/challenge/group/details/ChallengeGroupDetails'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'

interface Props {
  params: { id: string }
}

const Page = async ({ params }: Props) => {
  const id = Number(params.id)
  if (isNaN(id)) return notFound()

  const queryClient = getQueryClient()

  return <ChallengeGroupDetails challengeId={id} />

  // try {
  //   await queryClient.prefetchQuery({
  //     queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(id),
  //     queryFn: () => getGroupChallengeDetails(id),
  //   })

  //   const dehydratedState = dehydrate(queryClient)

  //   return (
  //     // <HydrationBoundary state={dehydratedState}>
  //     // <ChallengeGroupDetails challengeId={id} />
  //     // </HydrationBoundary>
  //   )
  // } catch (err) {
  //   console.error('[SSR] 그룹 챌린지 상세 데이터 로드 실패:', err)
  //   return <div>챌린지 상세 정보를 불러오는 데 실패했습니다.</div>
  // }
}

export default Page
