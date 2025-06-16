'use client'
import { useRouter } from 'next/navigation'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import type { ChallengeStatus } from '@features/challenge/api/participate/group-participant'
import { getGroupParticipationsCount } from '@features/challenge/api/participate/group-participant-count'
import ChallengeCard from '@features/challenge/components/challenge/participate/GroupChallengeParticipantCard'
import { useInfiniteGroupParticipations } from '@features/challenge/hook/useInfiniteGroupParticipations'
import Loading from '@shared/components/loading'
import NoContent from '@shared/components/no-content/no-content'
import SwitchTap from '@shared/components/switchtap/SwitchTap'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

const statusMap: Record<number, ChallengeStatus> = {
  0: 'not_started',
  1: 'ongoing',
  2: 'completed',
}

export default function ChallengeParticipatePage() {
  const [tab, setTab] = useState(1)
  const status = statusMap[tab]
  const router = useRouter()

  // 실제 API 훅
  const {
    data: challengeData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGroupParticipations(status)

  const { data: countData } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.COUNT,
    queryFn: getGroupParticipationsCount,
    ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.COUNT,
  })

  const counts = countData?.data.count

  const challenges = (challengeData?.pages ?? []).flatMap(page => page?.data?.challenges ?? [])

  // const url = URL.CHALLENGE.PARTICIPATE.DETAILS
  const tabLabels = [
    `인증 대기 (${counts?.notStarted ?? 0})`,
    `진행 중 (${counts?.ongoing ?? 0})`,
    `완료/종료 (${counts?.completed ?? 0})`,
  ]

  // 무한 스크롤
  const loadMoreRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (error || !hasNextPage || !loadMoreRef.current) return
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
  }, [error, hasNextPage, isFetchingNextPage, fetchNextPage])

  let challengeContents
  const isChallengeExists: boolean = challenges && challenges.length > 0
  if (isChallengeExists) {
    challengeContents = (
      <ListWrapper>
        {challenges.map(challenge => {
          const { id, title, thumbnailUrl, startDate, endDate, achievement, achievementRecords } = challenge
          return (
            <ChallengeCard
              key={id}
              title={title}
              imageUrl={thumbnailUrl}
              startDate={new Date(startDate)}
              endDate={new Date(endDate)}
              successCount={achievement.success}
              maxCount={achievement.total}
              record={achievementRecords}
              onClick={() => router.push(URL.CHALLENGE.PARTICIPATE.DETAILS.value(id))}
            />
          )
        })}
      </ListWrapper>
    )
  } else {
    challengeContents = !isLoading && (
      <NoContent
        title='챌린지가 없습니다'
        buttonText='참여하러 가기'
        clickHandler={() => {
          router.push(URL.MAIN.INDEX.value)
        }}
      />
    )
  }

  return (
    <Container>
      <SwitchTapContainer>
        <SwitchTap tabs={tabLabels} currentIndex={tab} onChange={setTab} />
      </SwitchTapContainer>

      <CardListContainer isChallengeExists={isChallengeExists}>
        {challengeContents}
        {(isFetchingNextPage || isLoading) && <Loading />}
        {!hasNextPage && !isLoading && challenges.length > 0 && <EndMessage>모든 챌린지를 불러왔습니다</EndMessage>}
        {!error && hasNextPage && isLoading && (
          <ObserverTrigger ref={loadMoreRef}>{isFetchingNextPage ? '불러오는 중…' : ''}</ObserverTrigger>
        )}
      </CardListContainer>
    </Container>
  )
}

// 전체 페이지 컨테이너
const Container = styled.div`
  ${responsiveHorizontalPadding};

  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  height: 100%;
`

// 상단 탭 컨테이너
const SwitchTapContainer = styled.div`
  width: 100%;

  align-self: center;
  flex-shrink: 0; /* 헤더 크기 고정 */
`

// 카드 리스트 컨테이너
const CardListContainer = styled.div<{ isChallengeExists: boolean }>`
  width: 100%;
  height: ${({ isChallengeExists }) => (!isChallengeExists ? '100%' : 'fit-content')};

  display: flex;
  align-self: center;
  flex-direction: column; /* 세로 방향으로 설정 */
  overflow: hidden; /* 내부 스크롤만 보이도록 설정 */
  gap: 24px;
`

const ListWrapper = styled.div`
  margin-top: 10px;
  flex: 1;

  flex-direction: column;
  gap: 16px;
  overflow-y: auto; /* 내부 스크롤 활성화 */
`

const ObserverTrigger = styled.div`
  height: 1px;
  padding: 0 20px;
  flex-shrink: 0; /* 크기 고정 */
`

const EndMessage = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`
