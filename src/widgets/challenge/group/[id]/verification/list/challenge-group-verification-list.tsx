'use client'

import { useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { useInfiniteGroupChallengeVerifications } from '@/features/challenge/api'
import { VerificationCard } from '@/features/challenge/components'

import { getGroupChallengeDetails } from '@/entities/challenge/api'

import { LucideIcon } from '@/shared/components'
import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { URL } from '@/shared/constants'

import * as S from './styles'

interface ChallengeGroupParticipateListProps {
  challengeId: number
}

export const ChallengeGroupParticipateList = ({ challengeId }: ChallengeGroupParticipateListProps) => {
  const router = useRouter()

  /** 단체 챌린지 상세 가져오기 */
  const { data: challengeData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId),
    queryFn: () => getGroupChallengeDetails(challengeId),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.DETAILS,
  })
  /** 인증 목록 조회 */
  const {
    data: verificationData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGroupChallengeVerifications(challengeId)

  const challenge = challengeData?.data

  const verifications = verificationData?.pages.flatMap(page => page?.data?.verifications || []) ?? []
  // const verifications = verificationsDummy

  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !observerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  /** 이벤트 핸들러 */
  const handleParticipateChallenge = () => {
    // 단체 챌린지 상세로 이동
    router.push(URL.CHALLENGE.GROUP.DETAILS.value(challengeId))
  }

  return (
    <S.Wrapper>
      <S.ChallengeDataWrapper>
        <S.Title>{challenge?.title}</S.Title>
        <S.Participant>
          <LucideIcon name='UsersRound' size={16} color='lfBlue' /> {challenge?.currentParticipantCount}명 참여중
        </S.Participant>
      </S.ChallengeDataWrapper>
      <S.ContentsWrapper>
        {verifications.length !== 0 ? (
          verifications.map(verificationData => (
            <VerificationCard key={verificationData.id} challengeId={challengeId} verificationData={verificationData} />
          ))
        ) : (
          <S.StyledNoContentFeedback
            title='아직 인증 내역이 없습니다'
            buttonText='참여하러 가기'
            clickHandler={handleParticipateChallenge}
          />
        )}
      </S.ContentsWrapper>
      {!hasNextPage && !isLoading && verifications.length > 0 && (
        <S.EndMessage>인증 내역을 모두 불러왔습니다</S.EndMessage>
      )}
      <S.ObserverTrigger ref={observerRef} />
    </S.Wrapper>
  )
}
