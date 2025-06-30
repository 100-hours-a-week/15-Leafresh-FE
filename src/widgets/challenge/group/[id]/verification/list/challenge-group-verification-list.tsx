'use client'

import { useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { useInfiniteGroupChallengeVerifications } from '@/features/challenge/api'
import { VerificationCard } from '@/features/challenge/components'

import { getGroupChallengeDetails } from '@/entities/challenge/api'

import { LucideIcon, NoContentFeedback } from '@/shared/components'
import { theme, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { URL } from '@/shared/constants'
import { responsiveHorizontalPadding } from '@/shared/styles'

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
    <Wrapper>
      <ChallengeDataWrapper>
        <Title>{challenge?.title}</Title>
        <Participant>
          <LucideIcon name='UsersRound' size={16} color='lfBlue' /> {challenge?.currentParticipantCount}명 참여중
        </Participant>
      </ChallengeDataWrapper>
      <ContentsWrapper>
        {verifications.length !== 0 ? (
          verifications.map(verificationData => (
            <VerificationCard key={verificationData.id} challengeId={challengeId} verificationData={verificationData} />
          ))
        ) : (
          <StyledNoContentFeedback
            title='아직 인증 내역이 없습니다'
            buttonText='참여하러 가기'
            clickHandler={handleParticipateChallenge}
          />
        )}
      </ContentsWrapper>
      {!hasNextPage && !isLoading && verifications.length > 0 && <EndMessage>인증 내역을 모두 불러왔습니다</EndMessage>}
      <ObserverTrigger ref={observerRef} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;

  ${responsiveHorizontalPadding};

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 18px;
`
const ChallengeDataWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;

  font-size: ${theme.fontSize.lg};
`

const Title = styled.h1`
  text-align: center;
  font-weight: ${theme.fontWeight.bold};
  border-bottom: 1px solid ${theme.colors.lfDarkGray.base};
`

const Participant = styled.div`
  margin-top: 12px;
  align-self: flex-end;

  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlue.base};

  display: flex;
  align-items: center;
  gap: 5px;
`

const ContentsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 28px;
`

const ObserverTrigger = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
`

const StyledNoContentFeedback = styled(NoContentFeedback)`
  height: 100%;
`

const EndMessage = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`
