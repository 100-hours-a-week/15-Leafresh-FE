import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getVerificationCommemtList } from '@entities/challenge/api/group/verification/comments/get-comment-list'
import { getVerificationDetails } from '@entities/challenge/api/group/verification/get-verification-details'
import VerificationDetails from '@features/challenge/components/challenge/participate/verification/details/VerificationDetails'
import { getQueryClient } from '@shared/config/tanstack-query/query-client'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

interface PageProps {
  params: Promise<{
    id: string
    verificationId: string
  }>
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params
  const { verificationId } = await params

  const queryClient = getQueryClient()

  const challengeIdNum = Number(id)
  const verificationIdNum = Number(verificationId)
  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.DETAILS(challengeIdNum, verificationIdNum),
        queryFn: () => getVerificationDetails({ challengeId: challengeIdNum, verificationId: verificationIdNum }),
        ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.DETAILS,
      }),

      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT(challengeIdNum, verificationIdNum),
        queryFn: () => getVerificationCommemtList(challengeIdNum, verificationIdNum),
        ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.COMMENT,
      }),
    ])

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <VerificationDetails challengeId={challengeIdNum} verificationId={verificationIdNum} />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 그룹 챌린지 데이터 프리패치 실패:', err)
    return <div>챌린지 인증 정보를 불러오는 데 실패했습니다.</div>
  }
}

export default Page
