'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'

import SwitchTap from '@shared/components/switchtap/SwitchTap'
import Chatbot from '@shared/components/chatbot/Chatbot'

import ChallengeCard from '@features/challenge/components/challenge/participate/GroupChallengeParticipantCard'
import CardList from '@features/challenge/components/challenge/participate/GroupChallengeParticipantCardList'

import { useInfiniteGroupParticipations } from '@features/challenge/hook/useInfiniteGroupParticipations'
import { useGroupParticipationsCount, CountObj } from '@features/challenge/hook/useGroupParticipationsCount'
import type { ChallengeStatus } from '@features/challenge/api/participate/group-participant'
import { URL } from '@shared/constants/route/route'

const statusMap: Record<number, ChallengeStatus> = {
  0: 'not_started',
  1: 'ongoing',
  2: 'completed',
}

export default function ChallengeParticipatePage() {
  const [tab, setTab] = useState(0)
  const status = statusMap[tab]
  const router = useRouter()

  // 실제 API 훅
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteGroupParticipations(status)

  const { data: CountObj } = useGroupParticipationsCount()

  // API 오류 여부
  const hasError = Boolean(error)

  // API 정상 시 실제 챌린지, 오류 시 dummy 전체
  const realChallenges = data?.pages.flatMap(p => p.data.challenges) ?? []
  const url = URL.CHALLENGE.PARTICIPATE.DETAILS
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

  // if (isLoading && !hasError) return <div>Loading challenges…</div>

  return (
    <Container>
      <SwitchTapContainer>
        <SwitchTap tabs={tabLabels} currentIndex={tab} onChange={setTab} />
      </SwitchTapContainer>

      <CardListContainer>
        <CardList>
          {realChallenges.map(c => (
            <ChallengeCard
              key={c.id}
              title={c.title}
              imageUrl={c.thumbnailUrl}
              startDate={new Date(c.startDate)}
              endDate={new Date(c.endDate)}
              successCount={c.achievement.success}
              maxCount={c.achievement.total}
              onClick={() => router.push(URL.CHALLENGE.PARTICIPATE.DETAILS.value(c.id))}
            />
          ))}
          {/* API 정상일 때만 무한 스크롤 트리거 */}
          {!hasError && hasNextPage && isLoading && (
            <ObserverTrigger ref={loadMoreRef}>{isFetchingNextPage ? '불러오는 중…' : ''}</ObserverTrigger>
          )}
        </CardList>
      </CardListContainer>
      <Chatbot />
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
  align-self: center;
  flex-shrink: 0; /* 헤더 크기 고정 */
`

// 카드 리스트 컨테이너
const CardListContainer = styled.div`
  flex: 1; /* 남은 공간 모두 차지하도록 변경 */
  margin-left: 8px;
  display: flex;
  align-self: center;
  flex-direction: column; /* 세로 방향으로 설정 */
  overflow: hidden; /* 내부 스크롤만 보이도록 설정 */
  padding: 0 20px;
`

const ObserverTrigger = styled.div`
  height: 1px;
  padding: 0 20px;
  flex-shrink: 0; /* 크기 고정 */
`
