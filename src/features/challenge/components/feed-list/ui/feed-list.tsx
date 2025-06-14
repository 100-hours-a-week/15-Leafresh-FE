import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'

import { VerificationData } from '@entities/challenge/api/group/feed/get-feed-list'
import { useInfiniteGroupChallengeFeedList } from '@features/challenge/api'
import Loading from '@shared/components/loading'
import { ISOFormatString } from '@shared/types/date'

import VerificationCard from '../../verification-card/ui/verification-card'
import { FeedListProps } from '../model/types'
import * as S from './styles'

const verificationsDummy: VerificationData[] = [
  {
    id: 1,
    challengeId: 1,
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
    challengeId: 2,
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
    challengeId: 3,
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
// const verificationsDummy: Verification[] = []GIT

export const FeedList = ({ category, className }: FeedListProps): ReactNode => {
  const router = useRouter()

  /** 인증 피드 목록 조회 API */
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteGroupChallengeFeedList(category)

  const observerRef = useRef<HTMLDivElement | null>(null)

  /** 무한스크롤 데이터 조회 */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.6,
      },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // TODO: 실제 데이터로 교체하기
  // const verifications = verificationData?.pages.flatMap(page => page?.data?.items || []) ?? []
  const verifications = verificationsDummy
  console.log(verifications)

  let contents
  if (isLoading) {
    contents = <Loading />
  } else if (!verifications || verifications.length === 0) {
    /** 검색값이 없는 경우 */
    contents = (
      <S.StyledNoContent
        title='검색 결과가 없습니다'
        buttonText='챌린지 생성하기'
        // TODO: 메인의 단체 챌린지로 라우팅 (페이지의 섹션을 나눠서 딱 챌린지 쪽으로 포커스 가게 만들기)
        clickHandler={() => {}}
      />
    )
  } else {
    /** 검색값이 있는 경우 */
    contents = verifications.map(verificationData => (
      <VerificationCard
        key={verificationData.id}
        challengeId={verificationData.challengeId}
        verificationData={verificationData}
      />
    ))
  }

  return (
    <S.Wrapper className={className} isLoading={isLoading}>
      {contents}
      {!hasNextPage && !isLoading && verifications.length > 0 && <S.EndMessage>모든 인증을 불러왔습니다</S.EndMessage>}
      <S.ObserverTrigger ref={observerRef} />
    </S.Wrapper>
  )
}
