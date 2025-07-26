'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import { LeafIcon } from '@/shared/assets'
import { URL } from '@/shared/constants'
import { ISOFormatString } from '@/shared/type'

import * as S from './styles'

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
    <S.CardContainer onClick={() => router.push(URL.CHALLENGE.GROUP.DETAILS.value(challenge.id))} className={className}>
      <S.ImageContainer>
        {challenge?.thumbnailUrl && challenge.thumbnailUrl !== 'string' ? (
          <S.CoverImage src={challenge.thumbnailUrl} alt={challenge?.title || '챌린지 이미지'} />
        ) : (
          <S.PlaceholderWrapper>
            <S.PlaceholderIcon>
              <S.PlaceholderIconInner>
                <S.PlaceholderCircle />
                <S.PlaceholderRect />
              </S.PlaceholderIconInner>
            </S.PlaceholderIcon>
          </S.PlaceholderWrapper>
        )}
      </S.ImageContainer>

      <S.ContentContainer>
        <S.Title>{challenge?.title && challenge.title !== 'string' ? challenge.title : '텀블러 사용'}</S.Title>

        <S.TagsContainer>
          <S.Tag>{challenge.remainingDay === 0 ? '# 오늘부터 시작' : `#${challenge.remainingDay}일 뒤 시작`}</S.Tag>
          <S.Tag># {challenge?.currentParticipantCount || 0}명 참여중</S.Tag>
        </S.TagsContainer>

        <S.RewardBadge>
          <LeafIcon width={24} height={24} />
          <S.RewardText>{challenge?.leafReward || 30}개</S.RewardText>
        </S.RewardBadge>
      </S.ContentContainer>
    </S.CardContainer>
  )
}
