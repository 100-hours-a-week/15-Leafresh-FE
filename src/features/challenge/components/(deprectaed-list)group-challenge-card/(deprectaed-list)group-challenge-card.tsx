'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'

import LeafIcon from '@/shared/assets/icon/leaf.svg'
import { URL } from '@/shared/constants'
import { ISOFormatString } from '@/shared/type'

interface GroupChallengeProps {
  challenge: {
    id: number
    title: string
    thumbnailUrl: string
    leafReward: number
    startDate: ISOFormatString
    endDate: ISOFormatString
    remainingDay: number
    currentParticipantCount: number
  }
  className?: string
}

export const DeprecatedGroupChallengeCard: React.FC<GroupChallengeProps> = ({ challenge, className }) => {
  const router = useRouter()
  return (
    <CardContainer onClick={() => router.push(URL.CHALLENGE.GROUP.DETAILS.value(challenge.id))} className={className}>
      <ImageContainer>
        {challenge?.thumbnailUrl && challenge.thumbnailUrl !== 'string' ? (
          <CoverImage src={challenge.thumbnailUrl} alt={challenge?.title || '챌린지 이미지'} />
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
      </ImageContainer>

      <ContentContainer>
        <Title>{challenge?.title && challenge.title !== 'string' ? challenge.title : '텀블러 사용'}</Title>

        <TagsContainer>
          <Tag>{challenge.remainingDay === 0 ? '# 오늘부터 시작' : `#${challenge.remainingDay}일 뒤 시작`}</Tag>
          <Tag># {challenge?.currentParticipantCount || 0}명 참여중</Tag>
        </TagsContainer>

        <RewardBadge>
          <LeafIcon width={24} height={24} />
          <RewardText>{challenge?.leafReward || 30}개</RewardText>
        </RewardBadge>
      </ContentContainer>
    </CardContainer>
  )
}

const CardContainer = styled.div`
  cursor: pointer;
  width: 180px;
  border-radius: ${({ theme }) => theme.radius.base};
  overflow: hidden;
  cursor: pointer;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
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
  align-self: flex-end;
  margin-top: 14px;

  display: flex;
  align-items: center;
  margin-right: 8px;
  border-radius: 5px;
`

const RewardText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xss};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 10px 8px;
`

const Title = styled.div`
  margin-bottom: 10px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const TagsContainer = styled.div`
  display: flex;
  align-items: center;

  gap: 8px;
`

const Tag = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${({ theme }) => theme.fontSize.xss};
  color: #3b82f6;
`
