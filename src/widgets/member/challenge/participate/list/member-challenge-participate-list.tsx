'use client'
import { useEffect, useRef, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { useInfiniteGroupParticipations } from '@/features/challenge/api'
import { GroupChallengeParticipantCard } from '@/features/challenge/components'

import { ChallengeStatus, getGroupParticipationsCount } from '@/entities/member/api'

import { Loading, NoContent, SwitchTap } from '@/shared/components'
import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { URL } from '@/shared/constants'

import * as S from './styles'

const statusMap: Record<ChallengeStatus, number> = {
  not_started: 0,
  ongoing: 1,
  completed: 2,
}
const reverseStatusMap: Record<number, ChallengeStatus> = {
  0: 'not_started',
  1: 'ongoing',
  2: 'completed',
}

export function ChallengeParticipatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status: ChallengeStatus = (searchParams.get('status') as ChallengeStatus) || 'ongoing'

  const [tab, setTab] = useState(statusMap[status])

  /** 탭 변경 핸들러 */
  const handleChangeTab = (tab: number) => {
    const status = reverseStatusMap[tab]
    setTab(tab)
    router.push(URL.MEMBER.CHALLENGE.PARTICIPATE.LIST.value(status))
  }

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
      <S.ListWrapper>
        {challenges.map((challenge, index) => {
          const { id, title, thumbnailUrl, startDate, endDate, achievement, achievementRecords } = challenge
          const isPriorityCard = tab === 1 && index === 0
          return (
            <GroupChallengeParticipantCard
              key={id}
              title={title}
              imageUrl={thumbnailUrl}
              startDate={new Date(startDate)}
              endDate={new Date(endDate)}
              successCount={achievement.success}
              maxCount={achievement.total}
              record={achievementRecords}
              imagePriority={isPriorityCard}
              onClick={() => router.push(URL.MEMBER.CHALLENGE.VERIFICATION.STATUS.value(id))}
            />
          )
        })}
      </S.ListWrapper>
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
    <S.Container>
      <S.SwitchTapContainer>
        <SwitchTap tabs={tabLabels} currentIndex={tab} onChange={handleChangeTab} />
      </S.SwitchTapContainer>

      <S.CardListContainer isChallengeExists={isChallengeExists}>
        {challengeContents}
        {(isFetchingNextPage || isLoading) && <Loading />}
        {!hasNextPage && !isLoading && challenges.length > 0 && <S.EndMessage>모든 챌린지를 불러왔습니다</S.EndMessage>}
        {!error && hasNextPage && isLoading && (
          <S.ObserverTrigger ref={loadMoreRef}>{isFetchingNextPage ? '불러오는 중…' : ''}</S.ObserverTrigger>
        )}
      </S.CardListContainer>
    </S.Container>
  )
}
