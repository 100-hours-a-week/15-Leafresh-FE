'use client'
import { useRouter } from 'next/navigation'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import type { ChallengeStatus, ParticipantChallengeItem } from '@features/challenge/api/participate/group-participant'
import ChallengeCard from '@features/challenge/components/challenge/participate/GroupChallengeParticipantCard'
import CardList from '@features/challenge/components/challenge/participate/GroupChallengeParticipantCardList'
import { useGroupParticipationsCount } from '@features/challenge/hook/useGroupParticipationsCount'
import { useInfiniteGroupParticipations } from '@features/challenge/hook/useInfiniteGroupParticipations'
import Loading from '@shared/components/loading'
import NoContent from '@shared/components/no-content/no-content'
import SwitchTap from '@shared/components/switchtap/SwitchTap'
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

  const { data: CountData } = useGroupParticipationsCount()

  const CountObj = CountData?.data.count

  // API 오류 여부
  const hasError = Boolean(error)

  const realChallenges: ParticipantChallengeItem[] =
    challengeData?.pages.flatMap(page => (Array.isArray(page.data?.challenges) ? page.data.challenges : [])) ?? []
  // const url = URL.CHALLENGE.PARTICIPATE.DETAILS
  const tabLabels = [
    `참여 전 (${CountObj?.notStarted ?? 0})`,
    `참여 중 (${CountObj?.ongoing ?? 0})`,
    `참여 완료 (${CountObj?.completed ?? 0})`,
  ]
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

  let challengeContents
  const isChallengeExists: boolean = realChallenges && realChallenges.length > 0
  if (isChallengeExists) {
    challengeContents = (
      <CardList>
        {realChallenges.map(challenge => {
          const { id, title, thumbnailUrl, startDate, endDate, achievement } = challenge
          return (
            <ChallengeCard
              key={id}
              title={title}
              imageUrl={thumbnailUrl}
              startDate={new Date(startDate)}
              endDate={new Date(endDate)}
              successCount={achievement.success}
              maxCount={achievement.total}
              onClick={() => router.push(URL.CHALLENGE.PARTICIPATE.DETAILS.value(id))}
            />
          )
        })}
      </CardList>
    )
  } else {
    challengeContents = (
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
        {isFetchingNextPage && <Loading />}
        {!hasNextPage && !isLoading && realChallenges.length > 0 && <EndMessage>모든 챌린지를 불러왔습니다</EndMessage>}
        {!hasError && hasNextPage && isLoading && (
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
