import { ReactNode } from 'react'

import { Badge } from '@features/member/api/get-recent-badge'
import styled from '@emotion/styled'
import Image from 'next/image'
import { theme } from '@shared/styles/theme'

interface RecentBadgeBoxProps {
  className?: string
  badges: Badge[]
}

const RecentBadgeBox = ({ className, badges }: RecentBadgeBoxProps): ReactNode => {
  return (
    <Container>
      <Title>나의 뱃지</Title>
      {badges.length > 0 ? (
        <BadgeWrapper>
          {badges.map((badge, index) => (
            <BadgeCard key={badge.id ?? index}>
              <BadgeImage src={badge.imageUrl} alt={badge.name} width={50} height={50} />
              <BadgeName>{badge.name}</BadgeName>
            </BadgeCard>
          ))}
        </BadgeWrapper>
      ) : (
        <NoContentWrapper>획득한 뱃지가 없습니다!</NoContentWrapper>
      )}
    </Container>
  )
}

export default RecentBadgeBox

const Container = styled.div`
  width: 322px;
  display: flex;
  align-self: center;
  justify-self: center;
  flex-direction: column;

  margin: 20px 0;
  padding: 15px;
  background-color: #eff9e8;
  border-radius: ${theme.radius.base};
`
const Title = styled.p``

const BadgeWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`

const BadgeCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: center;
  text-align: center;
`

const BadgeImage = styled(Image)`
  width: auto;
  width: 48px;
  height: 48px;
  object-fit: cover;
`
const BadgeName = styled.p`
  font-size: ${theme.fontSize.xs};
`

const NoContentWrapper = styled.div`
  margin-top: 10px;
  text-align: center;
  height: 50px;

  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semiBold};
`
