import { ReactNode } from 'react'

import { Badge } from '@features/member/api/profile/get-recent-badge'
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
      <TitleWrapper>
        <Title>나의 뱃지</Title>
      </TitleWrapper>
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
  width: 100%;
  display: flex;
  align-self: center;
  justify-self: center;
  flex-direction: column;

  width: 100%;
  background-color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfPrime};
  overflow: hidden;

  margin: 20px 0;
  /* padding: 15px; */
  border-radius: ${theme.radius.base};
`

const TitleWrapper = styled.div`
  height: 45px;
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  display: flex;
  align-items: center;
`
const Title = styled.p`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semiBold};
  padding: 0 0 0 20px;
  margin: 0;
`

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
