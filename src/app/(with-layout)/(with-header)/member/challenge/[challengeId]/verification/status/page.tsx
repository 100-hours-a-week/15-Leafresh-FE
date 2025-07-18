import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { GroupVerificationPage } from '@/widgets/member'

import { getGroupVerifications } from '@/entities/challenge/api'

import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

export default async function Page({ params }: { params: Promise<{ challengeId: string }> }) {
  const { challengeId } = await params

  const challengeIdNum = Number(challengeId)

  try {
    const queryClient = getQueryClient()

    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS(challengeIdNum),
      queryFn: () => getGroupVerifications(challengeIdNum),
      ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <GroupVerificationPage challengeId={challengeIdNum} />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 데이터 프리패치 실패:', err)
    return <div>챌린지 정보를 불러오는 데 실패했습니다.</div>
  }
}
