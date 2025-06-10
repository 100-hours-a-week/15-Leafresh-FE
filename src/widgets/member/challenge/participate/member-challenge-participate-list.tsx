'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import type { ChallengeStatus, ParticipantChallengeItem } from '@features/challenge/api/participate/group-participant'
import ChallengeCard from '@features/challenge/components/challenge/participate/GroupChallengeParticipantCard'
import CardList from '@features/challenge/components/challenge/participate/GroupChallengeParticipantCardList'
import { useGroupParticipationsCount } from '@features/challenge/hook/useGroupParticipationsCount'
import { useInfiniteGroupParticipations } from '@features/challenge/hook/useInfiniteGroupParticipations'
import SwitchTap from '@shared/components/switchtap/SwitchTap'
import { URL } from '@shared/constants/route/route'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'
import { theme } from '@shared/styles/theme'

const statusMap: Record<number, ChallengeStatus> = {
  0: 'not_started',
  1: 'ongoing',
  2: 'completed',
}

export const MemberChallengeParticipateListPage = () => {
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

  if (isLoading && !hasError) return <div>Loading challenges…</div>

  return (
    <Container>
      <SwitchTapContainer>
        <SwitchTap tabs={tabLabels} currentIndex={tab} onChange={setTab} />
      </SwitchTapContainer>

      <CardListContainer>
        <CardList>
          {realChallenges.length > 0 ? (
            realChallenges.map(c => (
              <ChallengeCard
                key={c.id}
                title={c.title}
                imageUrl={c.thumbnailUrl}
                startDate={new Date(c.startDate)}
                endDate={new Date(c.endDate)}
                successCount={c.achievement.success}
                maxCount={c.achievement.total}
                onClick={() => router.push(URL.MEMBER.CHALLENGE.VERIFICATION.STATUS.value(c.id))}
              />
            ))
          ) : (
            <EmptySection>
              <Image src='/image/main-icon.svg' alt='Leafresh' width={80} height={60} style={{ alignSelf: 'center' }} />
              <EmptyState>참여 중인 챌린지가 없습니다.</EmptyState>
              <EmptyButton
                onClick={() => {
                  router.push(URL.MAIN.INDEX.value)
                }}
              >
                챌린지 참여하러 가기
              </EmptyButton>
            </EmptySection>
          )}
          {/* API 정상일 때만 무한 스크롤 트리거 */}
          {!hasError && hasNextPage && isLoading && (
            <ObserverTrigger ref={loadMoreRef}>{isFetchingNextPage ? '불러오는 중…' : ''}</ObserverTrigger>
          )}
        </CardList>
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
`

// 상단 탭 컨테이너
const SwitchTapContainer = styled.div`
  width: 100%;

  align-self: center;
  flex-shrink: 0; /* 헤더 크기 고정 */
`

// 카드 리스트 컨테이너
const CardListContainer = styled.div`
  width: 100%;
  flex: 1; /* 남은 공간 모두 차지하도록 변경 */

  display: flex;
  align-self: center;
  flex-direction: column; /* 세로 방향으로 설정 */
  overflow: hidden; /* 내부 스크롤만 보이도록 설정 */
`

const ObserverTrigger = styled.div`
  height: 1px;
  padding: 0 20px;
  flex-shrink: 0; /* 크기 고정 */
`
const EmptySection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: ${theme.colors.lfBlack.base};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`

const EmptyButton = styled.button`
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semiBold};
  width: 220px;
  height: 40px;
  align-self: center;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.lfPrime};
  cursor: pointer;
`
