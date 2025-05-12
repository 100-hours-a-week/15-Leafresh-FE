import Image from 'next/image'
import { useRouter } from 'next/navigation'

import React from 'react'
import styled from '@emotion/styled'

import { URL } from '@shared/constants/route/route'
import { theme } from '@shared/styles/theme'

interface GroupChallengeProps {
  challenge: {
    id: number
    title: string
    imageUrl: string
    leafReward: number
    startDate: string
    endDate: string
    remainingDay: number
    currentParticipantCount: number
  }
}

const GroupChallengeCard: React.FC<GroupChallengeProps> = ({ challenge }) => {
  const router = useRouter()
  return (
    <CardContainer onClick={() => router.push(URL.CHALLENGE.GROUP.DETAILS.value(challenge.id))}>
      <ImageContainer>
        {challenge?.imageUrl && challenge.imageUrl !== 'string' ? (
          <CoverImage src={challenge.imageUrl} alt={challenge?.title || '챌린지 이미지'} />
        ) : (
          <PlaceholderWrapper>
            <PlaceholderIcon>
              <PlaceholderIconInner>
                <PlaceholderCircle />
                <PlaceholderRect />
              </PlaceholderIconInner>
            </PlaceholderIcon>
          </PlaceholderWrapper>
        )}

        <RewardBadge>
          <Image src='/icon/leaf.png' alt='leaf' width={24} height={24} />
          <RewardText>{challenge?.leafReward || 30}개</RewardText>
        </RewardBadge>
      </ImageContainer>

      <ContentContainer>
        <Title>{challenge?.title && challenge.title !== 'string' ? challenge.title : '텀블러 사용'}</Title>

        <TagsContainer>
          <Tag>{challenge.remainingDay === 0 ? '# 오늘부터 시작' : `#${challenge.remainingDay}일 뒤 시작`}</Tag>
          <Tag>#{challenge?.currentParticipantCount || 0}명 참여중</Tag>
        </TagsContainer>
      </ContentContainer>
    </CardContainer>
  )
}

export default GroupChallengeCard

const CardContainer = styled.div`
  cursor: pointer;
  width: 180px;
  border-radius: ${theme.radius.base};
  overflow: hidden;
  box-shadow: ${theme.shadow.lfPrime};

  &:active {
    scale: 0.95;
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
`
//이미지가 유효하지 않을 시
const PlaceholderWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: #d1d5db;
`

const PlaceholderIcon = styled.div`
  display: flex;
  height: 4rem;
  width: 4rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  background-color: white;
`

const PlaceholderIconInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PlaceholderCircle = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 9999px;
  background-color: #d1d5db;
`

const PlaceholderRect = styled.div`
  margin-top: 0.5rem;
  height: 2rem;
  width: 3rem;
  background-color: #d1d5db;
`

const CoverImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`
const RewardBadge = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
  padding-right: 2px;
  border-radius: 5px;
`

const RewardText = styled.span`
  font-size: 8px;
  font-weight: ${theme.fontWeight.bold};
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 10px 5px;
`

const Title = styled.div`
  margin-bottom: 10px;
  font-size: ${theme.fontSize.sm};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: ${theme.fontWeight.medium};
`

const TagsContainer = styled.div`
  display: flex;
`

const Tag = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${theme.fontSize.xss};
  color: #3b82f6;
`
