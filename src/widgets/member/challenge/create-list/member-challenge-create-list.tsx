'use client'

import { ReactNode, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'

import { GroupChallenge, GroupChallengeCard } from '@/features/challenge/components'
import { useInfiniteMemberGroupChallengeCreations } from '@/features/member/api'

import { Loading, NoContent } from '@/shared/components'
import { theme } from '@/shared/config'
import { URL } from '@/shared/constants'
import { useAuth } from '@/shared/hooks'
import { responsiveHorizontalPadding } from '@/shared/styles'

export const MemberChallengeCreationsPage = (): ReactNode => {
  const router = useRouter()
  const { userInfo } = useAuth()

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } =
    useInfiniteMemberGroupChallengeCreations()
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !triggerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(triggerRef.current)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  /** 단체 챌린지 생성하러 가기 */
  const handleCreateChallenge = () => {
    router.push(URL.CHALLENGE.GROUP.CREATE.value())
  }

  const groupChallenges = data?.pages.flatMap(page => page?.data.groupChallenges || []) ?? []
  // const groupChallenges = dummyMemberGroupChallenge

  let contents: ReactNode

  if (isLoading) {
    contents = null
  } else if (groupChallenges.length === 0) {
    contents = (
      <StyledNoContent
        title='생성한 챌린지가 없습니다!'
        buttonText='챌린지 생성하러 가기'
        clickHandler={handleCreateChallenge}
      />
    )
  } else {
    contents = (
      <ChallengeList>
        {groupChallenges.map(groupChallenge => {
          const { id, imageUrl, name, description, currentParticipantCount, category, endDate, startDate } =
            groupChallenge
          const data: GroupChallenge = {
            id,
            imageUrl,
            name,
            description,
            currentParticipantCount,
            category,
            endDate,
            startDate,
          }
          return <GroupChallengeCard key={id} isAuth deleteCallback={() => refetch()} data={data} />
        })}
        {isFetchingNextPage && <Loading />}
        {!hasNextPage && !isLoading && groupChallenges.length > 0 && (
          <EndMessage>생성한 챌린지를 모두 불러왔습니다</EndMessage>
        )}
      </ChallengeList>
    )
  }

  return (
    <Wrapper>
      <Title>{userInfo?.nickname || '익명'}의 단체 챌린지</Title>
      {contents}
      <Observer ref={triggerRef}>{isFetchingNextPage && '불러오는 중...'}</Observer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${responsiveHorizontalPadding};

  width: 100%;
  height: 100%;

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
`

const Title = styled.h1`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  text-align: center;
`

const ChallengeList = styled.div`
  width: 100%;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const Observer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
`

const EndMessage = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`

const StyledNoContent = styled(NoContent)`
  height: 100%;
`

// const dummyMemberGroupChallenge: GroupChallengeResponse[] = [
//   {
//     id: 1,
//     name: '제로 웨이스트 도전!',
//     description: '일회용품 줄이기 미션에 도전하세요!',
//     startDate: '2025-06-01' as DateFormatString,
//     endDate: '2025-06-30' as DateFormatString,
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 42,
//     category: 'UPCYCLING',
//   },
//   {
//     id: 2,
//     name: '텀블러 챌린지',
//     description: '텀블러를 사용하고 인증해요!',
//     startDate: '2025-06-05' as DateFormatString,
//     endDate: '2025-06-20' as DateFormatString,
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 18,
//     category: 'ZERO_WASTE',
//   },
//   {
//     id: 3,
//     name: '플로깅 마스터',
//     description: '조깅하며 쓰레기를 줍는 챌린지!',
//     startDate: '2025-06-10' as DateFormatString,
//     endDate: '2025-07-10' as DateFormatString,
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 73,
//     category: 'ZERO_WASTE',
//   },
//   {
//     id: 4,
//     name: '친환경 장보기',
//     description: '비닐 대신 장바구니 쓰기 도전!',
//     startDate: '2025-06-15' as DateFormatString,
//     endDate: '2025-06-30' as DateFormatString,
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 55,
//     category: 'ZERO_WASTE',
//   },
//   {
//     id: 5,
//     name: '재활용 분리배출 고수',
//     description: '올바른 분리배출 습관 챌린지',
//     startDate: '2025-06-20' as DateFormatString,
//     endDate: '2025-07-15' as DateFormatString,
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 39,
//     category: 'ZERO_WASTE',
//   },
// ]
// const dummyMemberGroupChallenge: GroupChallengeResponse[] = []
