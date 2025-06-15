import { ReactNode } from 'react'

import { Badge } from '@entities/member/api'

import * as S from './styles'

interface RecentBadgeBoxProps {
  className?: string
  badges: Badge[]
}

export const RecentBadgeBox = ({ className, badges }: RecentBadgeBoxProps): ReactNode => {
  return (
    <S.Container>
      <S.TitleWrapper>
        <S.Title>나의 뱃지</S.Title>
      </S.TitleWrapper>
      {badges.length > 0 ? (
        <S.BadgeWrapper>
          {badges.map((badge, index) => (
            <S.BadgeCard key={badge.id ?? index}>
              <S.BadgeImage src={badge.imageUrl} alt={badge.name} width={50} height={50} />
              <S.BadgeName>{badge.name}</S.BadgeName>
            </S.BadgeCard>
          ))}
        </S.BadgeWrapper>
      ) : (
        <S.NoContentWrapper>아직 획득한 뱃지가 없습니다</S.NoContentWrapper>
      )}
    </S.Container>
  )
}
