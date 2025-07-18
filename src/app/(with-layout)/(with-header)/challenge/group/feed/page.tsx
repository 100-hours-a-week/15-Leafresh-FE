import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { FeedPage } from '@/widgets/challenge'

import { getGroupChallengeCategoryList } from '@/entities/challenge/api'

import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

const Page = async () => {
  const queryClient = getQueryClient()

  try {
    // 카테고리 목록 조회
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.CATEGORIES,
      queryFn: getGroupChallengeCategoryList,
      ...QUERY_OPTIONS.CHALLENGE.GROUP.CATEGORIES,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <FeedPage />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 전체 실패', err)
    return <div>SSR 중 문제가 발생했습니다. 콘솔을 확인해주세요.</div>
  }
}

export default Page
