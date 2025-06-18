import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getGroupVerifications } from '@features/challenge/api/participate/verification/group-verification-list'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'

import GroupVerificationPage from '../../../../../../../../widgets/member/challenge/verification/status/ui/GroupVerificationPage'

export default async function Page({ params }: { params: Promise<{ participateId: string }> }) {
  const { participateId } = await params

  const idNum = Number(participateId)

  try {
    const queryClient = getQueryClient()

    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS(idNum),
      queryFn: () => getGroupVerifications(idNum),
      ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <GroupVerificationPage participateId={idNum} />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 데이터 프리패치 실패:', err)
    return <div>챌린지 정보를 불러오는 데 실패했습니다.</div>
  }
}
