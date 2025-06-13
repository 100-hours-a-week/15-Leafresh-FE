// app/(with-header)/challenge/group/[id]/page.tsx

import { notFound } from 'next/navigation'

import { getGroupChallengeDetails } from '@entities/challenge/api/group/get-group-details'
import { getGroupChallengeParticipateList } from '@entities/challenge/api/group/verification/get-group-verification-list'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ChallengeGroupVerificationListPage } from '@widgets/challenge'

interface PageProps {
  params: Promise<{ id: string }>
}

const Page = async ({ params }: PageProps) => {
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
        <ChallengeGroupVerificationListPage challengeId={idNumber} />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 데이터 프리패치 실패:', err)
    return <div>챌린지 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default Page
