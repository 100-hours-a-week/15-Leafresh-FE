'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { getGroupChallengeDetails } from '@features/challenge/api/get-group-challenge-details'
import { Verification } from '@features/challenge/api/participate/get-group-participant-list'
import VerificationCard from '@features/challenge/components/challenge/participate/verification/verification-card'
import { useInfiniteGroupChallengeVerifications } from '@features/challenge/hook/useInfiniteGroupChallengeVerifications'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { ISOFormatString } from '@shared/types/date'

import { ChallengeGroupVerificationListPageProps } from '../model/types'
import * as S from './styles'

import { useQuery } from '@tanstack/react-query'

// TODO: entities/constants로 이동
const verificationsDummy: Verification[] = [
  {
    id: 1,
    nickname: '지호개발자',
    profileImageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
    verificationImageUrl: '/image/banner.png',
    description:
      '제로 웨이스트 실천! 텀블러 사용 완료 🥤🌱 제로 웨이스트 실천! 텀블러 사용 완료 🥤🌱 제로 웨이스트 실천! 텀블러 사용 완료 🥤🌱',
    category: 'ZERO_WASTE',
    counts: {
      view: 120,
      like: 35,
      comment: 12,
    },
    createdAt: new Date().toISOString() as ISOFormatString,
    isLiked: true,
  },
  {
    id: 2,
    nickname: '그린라이프',
    profileImageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
    verificationImageUrl: '/image/banner.png',
    description: '재활용 분리수거 철저히 했습니다. 환경 보호는 습관!',
    category: 'PLOGGING',
    counts: {
      view: 89,
      like: 22,
      comment: 4,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() as ISOFormatString, // 5시간 전
    isLiked: false,
  },
  {
    id: 3,
    nickname: 'eco친구',
    profileImageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
    verificationImageUrl: '/image/banner.png',
    description: '비건 도시락 도전! 채식도 맛있어요 🥗',
    category: 'VEGAN',
    counts: {
      view: 45,
      like: 10,
      comment: 1,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() as ISOFormatString, // 하루 전
    isLiked: true,
  },
]
// const verificationsDummy: Verification[] = []

export const ChallengeGroupVerificationListPage = ({ challengeId }: ChallengeGroupVerificationListPageProps) => {
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

  // TODO: 실제 데이터로 교체하기
  // const verifications = verificationData?.pages.flatMap(page => page?.data?.items || []) ?? []
  const verifications = verificationsDummy

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
          <S.StyledNoContent
            title='아직 인증 내역이 없습니다'
            buttonText='참여하러 가기'
            clickHandler={handleParticipateChallenge}
          />
        )}
      </S.ContentsWrapper>
      {!hasNextPage && !isLoading && verifications.length > 0 && (
        <S.EndMessage>모든 챌린지를 불러왔습니다</S.EndMessage>
      )}
      <S.ObserverTrigger ref={observerRef} />
    </S.Wrapper>
  )
}
