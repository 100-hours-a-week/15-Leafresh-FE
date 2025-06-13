'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { ParticipantChallengeItem } from '@entities/challenge/api/participate/group-participant'
import ChallengeCard from '@features/challenge/components/challenge/participate/GroupChallengeParticipantCard'
import CardList from '@features/challenge/components/challenge/participate/GroupChallengeParticipantCardList'
import { useGroupParticipationsCount } from '@features/challenge/hook/useGroupParticipationsCount'
import { useInfiniteGroupParticipations } from '@features/challenge/hook/useInfiniteGroupParticipations'
import SwitchTap from '@shared/components/switchtap/SwitchTap'
import { URL } from '@shared/constants/route/route'

import { statusMap } from '../model/constants'
import * as S from './styles'

export const MemberChallengeParticipateListPage = () => {
  const [tab, setTab] = useState(1) // TODO: (refactor) tab ENUM화 시키기
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
    <S.Container>
      <S.SwitchTapContainer>
        <SwitchTap tabs={tabLabels} currentIndex={tab} onChange={setTab} />
      </S.SwitchTapContainer>

      <S.CardListContainer>
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
            <S.EmptySection>
              <Image src='/image/main-icon.svg' alt='Leafresh' width={80} height={60} style={{ alignSelf: 'center' }} />
              <S.EmptyState>참여 중인 챌린지가 없습니다.</S.EmptyState>
              <S.EmptyButton
                onClick={() => {
                  router.push(URL.MAIN.INDEX.value)
                }}
              >
                챌린지 참여하러 가기
              </S.EmptyButton>
            </S.EmptySection>
          )}
          {/* API 정상일 때만 무한 스크롤 트리거 */}
          {!hasError && hasNextPage && isLoading && (
            <S.ObserverTrigger ref={loadMoreRef}>{isFetchingNextPage ? '불러오는 중…' : ''}</S.ObserverTrigger>
          )}
        </CardList>
      </S.CardListContainer>
    </S.Container>
  )
}
