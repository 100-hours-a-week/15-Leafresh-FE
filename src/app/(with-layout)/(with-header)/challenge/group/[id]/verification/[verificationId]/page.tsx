import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { VerificationDetails } from '@/widgets/challenge'

import { getVerificationCommentList, getVerificationDetails } from '@/entities/challenge/api'

import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

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
        queryFn: () => getVerificationCommentList(challengeIdNum, verificationIdNum),
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
