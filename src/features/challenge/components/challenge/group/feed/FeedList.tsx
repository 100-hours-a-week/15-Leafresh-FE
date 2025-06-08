import { useRouter } from 'next/navigation'

import { ReactNode, useEffect, useRef } from 'react'
import styled from '@emotion/styled'

import { ChallengeCategoryType } from '@entities/challenge/type'
import { Verification } from '@features/challenge/api/feed/get-feed-list'
import { useInfiniteGroupChallengeFeedList } from '@features/challenge/hook/useInfiniteFeedList'
import Loading from '@shared/components/loading'
import NoContent from '@shared/components/no-content/no-content'

interface FeedListProps {
  category: ChallengeCategoryType
  className?: string
}

export const FeedList = ({ category, className }: FeedListProps): ReactNode => {
  const router = useRouter()

  /** 인증 피드 목록 조회 API */
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteGroupChallengeFeedList(category)

  const observerRef = useRef<HTMLDivElement | null>(null)

  /** 무한스크롤 */
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

  let contents
  const verifications: Verification[] = data?.pages.flatMap(page => page.data.verifications ?? []) ?? []
  if (isLoading) {
    contents = <Loading />
  } else if (!verifications || verifications.length === 0) {
    /** 검색값이 없는 경우 */
    contents = (
      <StyledNoContent
        title='검색 결과가 없습니다'
        buttonText='챌린지 생성하기'
        // TODO: 메인의 단체 챌린지로 라우팅 (페이지의 섹션을 나눠서 딱 챌린지 쪽으로 포커스 가게 만들기)
        clickHandler={() => {}}
      />
    )
  } else {
    /** 검색값이 있는 경우 */
    // contents = verifications.map(challenge => {
    //   const { id, title, leafReward, currentParticipantCount, endDate, startDate, remainingDay, thumbnailUrl } =
    //     challenge
    //   const data: GroupChallenge = {
    //     id,
    //     name: title,
    //     description: '더미 데이터', //TODO: 백엔드에서 description 데이터 추가해주면 넣기
    //     startDate,
    //     endDate,
    //     category, //TODO: 백엔드에서 description 데이터 추가해주면 넣기
    //     currentParticipantCount,
    //     imageUrl: thumbnailUrl,
    //     leafReward,
    //   }
    //   return <GroupChallengeCard key={id} data={data} isAuth={false} />
    // })
  }

  return <Wrapper className={className}></Wrapper>
}

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`
const StyledNoContent = styled(NoContent)`
  margin: 60px 0;
`
