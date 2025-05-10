import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { DayType } from '@entities/challenge/type'
import { getEventChallengeList } from '@features/challenge/api/get-event-challenge-list'
import { getGroupChallengeCategoryList } from '@features/challenge/api/get-group-challenge-categories'
import { getPersonalChallengeList } from '@features/challenge/api/get-personal-challenge-list'
import ChallengeMainPage from '@features/challenge/components/challenge/ChallengeMainPage'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'
import { QUERY_KEYS } from '@shared/constants/tanstack-query/query-keys'
import { getDayOfWeek } from '@shared/lib/date/utils'

const Page = async () => {
  try {
    console.log('[SSR] 시작')

    const queryClient = getQueryClient()
    const now = new Date()
    const dayOfWeek: DayType = getDayOfWeek(now)

    console.log('[SSR] 계산된 dayOfWeek:', dayOfWeek)

    await Promise.all([
      queryClient
        .prefetchQuery({
          queryKey: QUERY_KEYS.CHALLENGE.GROUP.CATEGORIES,
          queryFn: getGroupChallengeCategoryList,
        })
        .then(() => console.log('[SSR] 단체 카테고리 성공'))
        .catch(err => console.error('[SSR] 단체 카테고리 에러', err)),

      queryClient
        .prefetchQuery({
          queryKey: QUERY_KEYS.CHALLENGE.EVENT.LIST,
          queryFn: getEventChallengeList,
        })
        .then(() => console.log('[SSR] 이벤트 챌린지 성공'))
        .catch(err => console.error('[SSR] 이벤트 챌린지 에러', err)),

      queryClient
        .prefetchQuery({
          queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.LIST(dayOfWeek),
          queryFn: () => getPersonalChallengeList({ dayOfWeek }),
        })
        .then(() => console.log('[SSR] 개인 챌린지 성공'))
        .catch(err => console.error('[SSR] 개인 챌린지 에러', err)),
    ])

    const dehydratedState = dehydrate(queryClient)
    console.log('[SSR] Dehydrated 완료')

    return (
      <HydrationBoundary state={dehydratedState}>
        <></>
        <ChallengeMainPage />
      </HydrationBoundary>
    )
  } catch (err) {
    console.error('[SSR] 전체 실패', err)
    return <div>SSR 중 문제가 발생했습니다. 콘솔을 확인해주세요.</div>
  }
}

export default Page
