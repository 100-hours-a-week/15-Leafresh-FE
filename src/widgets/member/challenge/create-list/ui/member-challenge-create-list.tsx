'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'

import {
  GroupChallenge,
  GroupChallengeCard,
} from '@features/challenge/components/common/group-challenge-card/GroupChallengeCard'
import { useInfiniteMemberGroupChallengeCreations } from '@features/member/api/use-get-group-create-list'
import Loading from '@shared/components/loading/ui/loading'
import { URL } from '@shared/constants/route/route'
import { useAuth } from '@shared/hooks/useAuth/useAuth'

import * as S from './styles'

export const MemberChallengeCreateListPage = (): ReactNode => {
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
      <S.StyledNoContent
        title='생성한 챌린지가 없습니다!'
        buttonText='챌린지 생성하러 가기'
        clickHandler={handleCreateChallenge}
      />
    )
  } else {
    contents = (
      <S.ChallengeList>
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
          <S.EndMessage>생성한 모든 챌린지를 불러왔습니다</S.EndMessage>
        )}
      </S.ChallengeList>
    )
  }

  return (
    <S.Wrapper>
      <S.Title>{userInfo?.nickname || '익명'}의 단체 챌린지</S.Title>
      {contents}
      <S.Observer ref={triggerRef}>{isFetchingNextPage && '불러오는 중...'}</S.Observer>
    </S.Wrapper>
  )
}

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
