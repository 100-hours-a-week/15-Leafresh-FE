import {
  getEventChallengeList,
  getGroupChallengeCategoryList,
  getPersonalChallengeList,
} from '@/entities/challenge/api'
import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { DayType, getDayOfWeek } from '@/shared/lib'
import { MainPage } from '@/widgets/main'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

const Page = async () => {
  try {
    const queryClient = getQueryClient()
    const now = new Date()
    const dayOfWeek: DayType = getDayOfWeek(now)

    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.CHALLENGE.GROUP.CATEGORIES,
        queryFn: getGroupChallengeCategoryList,
        ...QUERY_OPTIONS.CHALLENGE.GROUP.CATEGORIES,
      }),

      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.CHALLENGE.EVENT.LIST,
        queryFn: getEventChallengeList,
        ...QUERY_OPTIONS.CHALLENGE.EVENT.LIST,
      }),

      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.LIST(dayOfWeek),
        queryFn: () => getPersonalChallengeList({ dayOfWeek }),
        ...QUERY_OPTIONS.CHALLENGE.PERSONAL.LIST,
      }),
    ])

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <MainPage />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 전체 실패', err)
    return <div>SSR 중 문제가 발생했습니다. 콘솔을 확인해주세요.</div>
  }
}

export default Page
