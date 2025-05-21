'use client'

const dummyMemberGroupChallenge: GroupChallengeResponse[] = [
  {
    id: 1,
    name: '제로 웨이스트 도전!',
    description: '일회용품 줄이기 미션에 도전하세요!',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
    currentParticipantCount: 42,
    category: 'ZERO_WASTE',
  },
  {
    id: 2,
    name: '텀블러 챌린지',
    description: '텀블러를 사용하고 인증해요!',
    startDate: '2025-06-05',
    endDate: '2025-06-20',
    imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
    currentParticipantCount: 18,
    category: 'ZERO_WASTE',
  },
  {
    id: 3,
    name: '플로깅 마스터',
    description: '조깅하며 쓰레기를 줍는 챌린지!',
    startDate: '2025-06-10',
    endDate: '2025-07-10',
    imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
    currentParticipantCount: 73,
    category: 'ZERO_WASTE',
  },
  {
    id: 4,
    name: '친환경 장보기',
    description: '비닐 대신 장바구니 쓰기 도전!',
    startDate: '2025-06-15',
    endDate: '2025-06-30',
    imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
    currentParticipantCount: 55,
    category: 'ZERO_WASTE',
  },
  {
    id: 5,
    name: '재활용 분리배출 고수',
    description: '올바른 분리배출 습관 챌린지',
    startDate: '2025-06-20',
    endDate: '2025-07-15',
    imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
    currentParticipantCount: 39,
    category: 'ZERO_WASTE',
  },
]
// const dummyMemberGroupChallenge: GroupChallengeResponse[] = []

import Image from 'next/image'

import { ReactNode, useEffect, useRef } from 'react'
import styled from '@emotion/styled'

import { GroupChallengeResponse } from '@features/member/api/challenge/get-group-creations'
import { useInfiniteMemberGroupChallengeCreations } from '@features/member/hooks/useInfiniteMemberChallengeCreationsList'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import LogoCharacterImage from '@public/image/main-icon.svg'

const MemberChallengeCreationsPage = (): ReactNode => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberGroupChallengeCreations()
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

  // TODO: 실제 데이터로 바꾸기
  const groupChallenges = data?.pages.flatMap(page => page?.data.groupChallenges || []) ?? []
  // const groupChallenges = dummyMemberGroupChallenge

  let contents: ReactNode

  if (isLoading) {
    contents = null
  } else if (groupChallenges.length === 0) {
    contents = (
      <EmptyWrapper>
        <Image src={LogoCharacterImage} alt='로고 캐릭터 ' />
        <NoChallengeMessage>생성한 챌린지가 없습니다!</NoChallengeMessage>
        <CreateButton>챌린지 생성하러 가기</CreateButton>
      </EmptyWrapper>
    )
  } else {
    contents = (
      <ChallengeList>
        {groupChallenges.map(groupChallenge => (
          <ChallengeCard key={groupChallenge.id}>
            <TopImageWrapper>
              <ChallengeImage src={groupChallenge.imageUrl} alt='챌린지 이미지' />
              <Badge>제로 웨이스트</Badge>
            </TopImageWrapper>
            <CardBody>
              <TopRow>
                <ChallengeName>{groupChallenge.name}</ChallengeName>
                <ActionButtons>
                  <EditButton type='button'>수정</EditButton>
                  <DeleteButton type='button'>삭제</DeleteButton>
                </ActionButtons>
              </TopRow>
              <ChallengeDesc>{groupChallenge.description.repeat(5)}</ChallengeDesc>
              <ParticipantCount>
                <LucideIcon name='UsersRound' size={12} color='lfBlue' />
                <span>{groupChallenge.currentParticipantCount}명 참여</span>
              </ParticipantCount>
            </CardBody>
          </ChallengeCard>
        ))}
      </ChallengeList>
    )
  }

  return (
    <Wrapper>
      <Title>노아의 단체 챌린지</Title>
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
  gap: 24px;
`

const ChallengeCard = styled.div`
  background: ${theme.colors.lfWhite.base};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${theme.shadow.lfInput};

  cursor: pointer;
`

const TopImageWrapper = styled.div`
  background: #d9d9d9;
  width: 100%;
  aspect-ratio: 2/1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ChallengeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Badge = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 12px 12px;
  background: ${theme.colors.lfGreenMain.base};
  opacity: 0.7;
  color: ${theme.colors.lfWhite.base};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  border-radius: ${theme.radius.full};
  transition: transform 2s ease-out;
  &:hover {
    opacity: 1;
  }
`

const CardBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ChallengeName = styled.div`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`

const ActionButtons = styled.div`
  display: flex;
  font-size: ${theme.fontSize.sm};
  gap: 8px;
`

const EditButton = styled.button`
  color: ${theme.colors.lfBlack.base};
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${theme.colors.lfBlue.base};
  }
`

const DeleteButton = styled.button`
  color: ${theme.colors.lfRed.base};
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${theme.colors.lfRed.hover};
  }
`

const ChallengeDesc = styled.div`
  margin: 10px 0 27px 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfBlack.base};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ParticipantCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlue.base};
`

const Observer = styled.div`
  height: 1px;
`

const EmptyWrapper = styled.div`
  width: 100%;
  flex: 1; // height 대신 부모 기준으로 확장
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`

const NoChallengeMessage = styled.div`
  margin-top: 10px;
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
`

const CreateButton = styled.button`
  width: 70%;
  max-width: 320px;
  padding: 20px 32px;

  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};

  border: none;
  border-radius: ${theme.radius.base};
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.lfGreenMain.hover};
  }
`
