'use client'

import { useRouter } from 'next/navigation'

import { ReactNode, useEffect, useRef } from 'react'
import styled from '@emotion/styled'

import {
  GroupChallenge,
  GroupChallengeCard,
} from '@features/challenge/components/common/group-challenge-card/GroupChallengeCard'
import { useInfiniteMemberGroupChallengeCreations } from '@features/member/hooks/useInfiniteMemberChallengeCreationsList'
import NoContent from '@shared/components/no-content/no-content'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import { theme } from '@shared/styles/theme'

const MemberChallengeCreationsPage = (): ReactNode => {
  const router = useRouter()
  const { userInfo, isLoggedIn } = useAuth()
  const openToast = useToast()

  const { openConfirmModal } = useConfirmModalStore()
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
    router.push(URL.CHALLENGE.GROUP.CREATE.value)
  }

  const groupChallenges = data?.pages.flatMap(page => page?.data.groupChallenges || []) ?? []
  // const groupChallenges = dummyMemberGroupChallenge

  let contents: ReactNode

  if (isLoading) {
    contents = null
  } else if (groupChallenges.length === 0) {
    contents = (
      <NoContent
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

export default MemberChallengeCreationsPage

const Wrapper = styled.div`
  min-height: calc(100dvh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; // ✔️ 여기서 중앙 배치로 전환
  padding: 24px 0;
`

const Title = styled.h1`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: 20px;
  text-align: center;
`

const ChallengeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const Observer = styled.div`
  height: 1px;
`

// const dummyMemberGroupChallenge: GroupChallengeResponse[] = [
//   {
//     id: 1,
//     name: '제로 웨이스트 도전!',
//     description: '일회용품 줄이기 미션에 도전하세요!',
//     startDate: '2025-06-01',
//     endDate: '2025-06-30',
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 42,
//     category: 'UPCYCLING',
//   },
//   {
//     id: 2,
//     name: '텀블러 챌린지',
//     description: '텀블러를 사용하고 인증해요!',
//     startDate: '2025-06-05',
//     endDate: '2025-06-20',
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 18,
//     category: 'ZERO_WASTE',
//   },
//   {
//     id: 3,
//     name: '플로깅 마스터',
//     description: '조깅하며 쓰레기를 줍는 챌린지!',
//     startDate: '2025-06-10',
//     endDate: '2025-07-10',
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 73,
//     category: 'ZERO_WASTE',
//   },
//   {
//     id: 4,
//     name: '친환경 장보기',
//     description: '비닐 대신 장바구니 쓰기 도전!',
//     startDate: '2025-06-15',
//     endDate: '2025-06-30',
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 55,
//     category: 'ZERO_WASTE',
//   },
//   {
//     id: 5,
//     name: '재활용 분리배출 고수',
//     description: '올바른 분리배출 습관 챌린지',
//     startDate: '2025-06-20',
//     endDate: '2025-07-15',
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 39,
//     category: 'ZERO_WASTE',
//   },
// ]
// const dummyMemberGroupChallenge: GroupChallengeResponse[] = []
