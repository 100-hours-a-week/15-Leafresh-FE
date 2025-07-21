import { ReactNode, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { useInfiniteGroupChallengeFeedList } from '@/features/challenge/api'

import { CHALLENGE_CATEGORY_PAIRS, convertLanguage, FilterChallengeCategoryType } from '@/entities/challenge/model'

import { Loading } from '@/shared/components'
import { URL } from '@/shared/constants'

import { VerificationCard } from '../verification-card'

import * as S from './styles'

interface FeedListProps {
  category: FilterChallengeCategoryType
  className?: string
}

export const FeedList = ({ category, className }: FeedListProps): ReactNode => {
  const router = useRouter()

  /** 인증 피드 목록 조회 API */
  const {
    data: verificationData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteGroupChallengeFeedList(category === 'ALL' ? undefined : category)

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
        observer.disconnect()
        // observer.unobserve(observerRef.current)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const verifications = verificationData?.pages.flatMap(page => page?.data?.verifications || []) ?? []
  // const verifications = verificationsDummy

  let contents
  if (isLoading) {
    contents = <Loading />
  } else if (!verifications || verifications.length === 0) {
    /** 검색값이 없는 경우 */
    let title: string
    if (category === 'ALL') {
      title = `챌린지가 없습니다`
    } else {
      const korCategory = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category) as string
      title = `${korCategory}\n 인증 내역이 없습니다`
    }
    contents = (
      <S.StyledNoContent
        title={title}
        buttonText='챌린지 참여하기'
        clickHandler={() => {
          router.push(URL.MAIN.INDEX.value)
        }}
      />
    )
  } else {
    /** 검색값이 있는 경우 */
    contents = verifications.map((verificationData, index) => (
      <VerificationCard
        key={verificationData.id}
        challengeId={verificationData.challengeId}
        verificationData={verificationData}
        isPriority={index === 0}
      />
    ))
  }

  return (
    <S.Wrapper className={className} isLoading={isLoading}>
      {contents}
      {!hasNextPage && !isLoading && verifications.length > 0 && <S.EndMessage>피드를 모두 불러왔습니다</S.EndMessage>}
      <S.ObserverTrigger ref={observerRef} />
    </S.Wrapper>
  )
}
