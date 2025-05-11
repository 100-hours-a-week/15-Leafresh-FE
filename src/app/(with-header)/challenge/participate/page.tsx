// 'use client'
// import React, { useState, useRef, useEffect } from 'react'
// import styled from '@emotion/styled'

// import SwitchTap from '@shared/components/switchtap/SwitchTap'

// import ChallengeCard from '@features/challenge/group/participate/components/GroupChallengeParticipantCard'
// import { useInfiniteGroupParticipations } from '@features/challenge/group/participate/hook/useInfiniteGroupParticipations'
// import type { ChallengeStatus } from '@features/challenge/group/participate/api/group-participant'
// import { useGroupParticipationsCount } from '@features/challenge/group/participate/hook/useGroupParticipationsCount'

// // 더미용 샘플 데이터
// const DUMMY_CHALLENGES = [
//   {
//     id: 0,
//     title: '텀블러 챌린지 (더미)',
//     thumbnailUrl: '/image/chatbot.png',
//     startDate: '2025-01-01',
//     endDate: '2025-02-01',
//     achievement: { success: 1, total: 5 },
//   },
//   {
//     id: 12,
//     title: '채식 챌린지 (더미)',
//     thumbnailUrl: '/image/chatbot.png',
//     startDate: '2025-03-01',
//     endDate: '2025-03-10',
//     achievement: { success: 4, total: 7 },
//   },
// ]

// const statusMap: Record<number, ChallengeStatus> = {
//   0: 'not_started',
//   1: 'ongoing',
//   2: 'completed',
// }

// export default function ChallengeParticipatePage() {
//   const [tab, setTab] = useState(0)
//   const status = statusMap[tab]

//   // 리스트용 infinite query
//   const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
//     useInfiniteGroupParticipations(status)

//   // 카운트용 queries
//   const countBefore = useGroupParticipationsCount('not_started')
//   const countOngoing = useGroupParticipationsCount('ongoing')
//   const countDone = useGroupParticipationsCount('completed')

//   // 탭 라벨에 카운트 붙이기
//   const tabLabels = [
//     `참여 전 (${countBefore.data ?? 0})`,
//     `참여 중 (${countOngoing.data ?? 0})`,
//     `참여 완료 (${countDone.data ?? 0})`,
//   ]

//   const loadMoreRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (!hasNextPage || !loadMoreRef.current) return
//     const obs = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !isFetchingNextPage) {
//           fetchNextPage()
//         }
//       },
//       { rootMargin: '200px' },
//     )
//     obs.observe(loadMoreRef.current)
//     return () => {
//       obs.disconnect()
//     }
//   }, [hasNextPage, isFetchingNextPage, fetchNextPage])

//   if (isLoading) return <div>Loading challenges…</div>
//   if (error) return <div>Error: {(error as Error).message}</div>

//   const challenges = data?.pages.flatMap(p => p.data.challenges) ?? []

//   const rawChallenges = error ? DUMMY_CHALLENGES : (data?.pages.flatMap(p => p.data.challenges) ?? [])

//   return (
//     <Container>
//       <SwitchTap tabs={tabLabels} currentIndex={tab} onChange={setTab} />

//       <List>
//         {rawChallenges.map(c => (
//           <ChallengeCard
//             key={c.id}
//             title={c.title}
//             imageUrl={c.thumbnailUrl}
//             startDate={new Date(c.startDate)}
//             endDate={new Date(c.endDate)}
//             successCount={c.achievement.success}
//             maxCount={c.achievement.total}
//             onClick={() => console.log(`Clicked challenge ${c.id}`)}
//           />
//         ))}
//       </List>

//       {hasNextPage && <ObserverTrigger ref={loadMoreRef}>{isFetchingNextPage ? '불러오는 중…' : ''}</ObserverTrigger>}
//     </Container>
//   )
// }

// const Container = styled.div`
//   padding: 20px;
//   max-width: 800px;
//   margin: 0 auto;
// `

// const List = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 16px;
// `

// const ObserverTrigger = styled.div`
//   height: 1px;
// `

'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'

import SwitchTap from '@shared/components/switchtap/SwitchTap'
import ChallengeCard from '@features/challenge/group/participate/components/GroupChallengeParticipantCard'
import CardList from '@features/challenge/group/participate/components/GroupChallengeParticipantCardList'

import { useInfiniteGroupParticipations } from '@features/challenge/group/participate/hook/useInfiniteGroupParticipations'
import { useGroupParticipationsCount } from '@features/challenge/group/participate/hook/useGroupParticipationsCount'
import type { ChallengeStatus } from '@features/challenge/group/participate/api/group-participant'

// 더미용 샘플 데이터
const DUMMY_CHALLENGES = [
  {
    id: 0,
    title: '텀블러 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-06-01', // 미래
    endDate: '2025-07-01',
    achievement: { success: 0, total: 5 },
  },
  {
    id: 1,
    title: '채식 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-04-01', // 완료
    endDate: '2025-04-10',
    achievement: { success: 7, total: 7 },
  },
  {
    id: 2,
    title: '걷기 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-05-01', // 진행 중
    endDate: '2025-06-01',
    achievement: { success: 3, total: 10 },
  },
  {
    id: 2,
    title: '걷기 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-05-01', // 진행 중
    endDate: '2025-06-01',
    achievement: { success: 3, total: 10 },
  },
  {
    id: 2,
    title: '걷기 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-05-01', // 진행 중
    endDate: '2025-06-01',
    achievement: { success: 3, total: 10 },
  },
  {
    id: 2,
    title: '걷기 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-05-01', // 진행 중
    endDate: '2025-06-01',
    achievement: { success: 3, total: 10 },
  },
  {
    id: 2,
    title: '걷기 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-05-01', // 진행 중
    endDate: '2025-06-01',
    achievement: { success: 3, total: 10 },
  },
  {
    id: 2,
    title: '걷기 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-05-01', // 진행 중
    endDate: '2025-06-01',
    achievement: { success: 3, total: 10 },
  },
  {
    id: 2,
    title: '걷기 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-05-01', // 진행 중
    endDate: '2025-06-01',
    achievement: { success: 3, total: 10 },
  },
  {
    id: 2,
    title: '걷기 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-05-01', // 진행 중
    endDate: '2025-06-01',
    achievement: { success: 3, total: 10 },
  },
  {
    id: 2,
    title: '걷기 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-05-01', // 진행 중
    endDate: '2025-06-01',
    achievement: { success: 3, total: 10 },
  },
  {
    id: 2,
    title: '걷기 챌린지 (더미)',
    thumbnailUrl: '/image/chatbot.png',
    startDate: '2025-05-01', // 진행 중
    endDate: '2025-06-01',
    achievement: { success: 3, total: 10 },
  },
]

const statusMap: Record<number, ChallengeStatus> = {
  0: 'not_started',
  1: 'ongoing',
  2: 'completed',
}

// 날짜 비교로 status 결정
const getStatusOf = (start: string, end: string): ChallengeStatus => {
  const now = new Date()
  const s = new Date(start),
    e = new Date(end)
  if (now < s) return 'not_started'
  if (now > e) return 'completed'
  return 'ongoing'
}

export default function ChallengeParticipatePage() {
  const [tab, setTab] = useState(0)
  const status = statusMap[tab]

  // 실제 API 훅
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteGroupParticipations(status)

  // 카운트 훅
  const countBefore = useGroupParticipationsCount('not_started')
  const countOngoing = useGroupParticipationsCount('ongoing')
  const countDone = useGroupParticipationsCount('completed')

  // API 오류 여부
  const hasError = Boolean(error)

  // API 정상 시 실제 챌린지, 오류 시 dummy 전체
  const realChallenges = data?.pages.flatMap(p => p.data.challenges) ?? []
  const rawChallenges = hasError ? DUMMY_CHALLENGES : realChallenges

  // 탭별 카운트: API 정상 → useQuery 결과, 오류 → dummy로 계산
  const counts = hasError
    ? ['not_started', 'ongoing', 'completed'].map(
        st => DUMMY_CHALLENGES.filter(dc => getStatusOf(dc.startDate, dc.endDate) === st).length,
      )
    : [countBefore.data ?? 0, countOngoing.data ?? 0, countDone.data ?? 0]

  const tabLabels = [`참여 전 (${counts[0]})`, `참여 중 (${counts[1]})`, `참여 완료 (${counts[2]})`]

  // 무한 스크롤
  const loadMoreRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (hasError || !hasNextPage || !loadMoreRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )
    obs.observe(loadMoreRef.current)
    return () => {
      obs.disconnect()
    }
  }, [hasError, hasNextPage, isFetchingNextPage, fetchNextPage])

  // if (isLoading && !hasError) return <div>Loading challenges…</div>

  return (
    <Container>
      <SwitchTapContainer>
        <SwitchTap tabs={tabLabels} currentIndex={tab} onChange={setTab} />
      </SwitchTapContainer>

      <CardListContainer>
        <CardList>
          {rawChallenges.map(c => (
            <ChallengeCard
              key={c.id}
              title={c.title}
              imageUrl={c.thumbnailUrl}
              startDate={new Date(c.startDate)}
              endDate={new Date(c.endDate)}
              successCount={c.achievement.success}
              maxCount={c.achievement.total}
              onClick={() => console.log(`Clicked challenge ${c.id}`)}
            />
          ))}
          {/* API 정상일 때만 무한 스크롤 트리거 */}
          {!hasError && hasNextPage && (
            <ObserverTrigger ref={loadMoreRef}>{isFetchingNextPage ? '불러오는 중…' : ''}</ObserverTrigger>
          )}
        </CardList>
      </CardListContainer>
    </Container>
  )
}

// 전체 페이지 컨테이너
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  padding: 0;
`

// 상단 탭 컨테이너
const SwitchTapContainer = styled.div`
  padding: 20px 20px 16px 20px;
  flex-shrink: 0; /* 헤더 크기 고정 */
`

// 카드 리스트 컨테이너
const CardListContainer = styled.div`
  flex: 1; /* 남은 공간 모두 차지하도록 변경 */
  display: flex;
  flex-direction: column; /* 세로 방향으로 설정 */
  overflow: hidden; /* 내부 스크롤만 보이도록 설정 */
  padding: 0 20px;
`

const ObserverTrigger = styled.div`
  height: 1px;
  padding: 0 20px;
  flex-shrink: 0; /* 크기 고정 */
`
