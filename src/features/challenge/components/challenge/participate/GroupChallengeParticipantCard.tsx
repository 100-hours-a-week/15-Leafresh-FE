import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'

interface ChallengeProps {
  className?: string
  imageUrl?: string
  title: string
  startDate: Date
  endDate: Date
  successCount: number
  maxCount: number
  onClick?: () => void
}

const GroupChallengeParticipantCard = ({
  className,
  imageUrl = '',
  title,
  startDate,
  endDate,
  successCount,
  maxCount,
  onClick,
}: ChallengeProps): ReactNode => {
  // Format dates to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // 진행률 계산
  const progressPercentage = (successCount / maxCount) * 100

  return (
    <CardContainer className={className} onClick={onClick}>
      <LeftSection>
        <ChallengeImage src={imageUrl} alt={title} width={120} height={120} />
      </LeftSection>
      <RightSection>
        <TitleSection>
          <Title>{title}</Title>
          <ArrowIcon onClick={onClick}>&gt;</ArrowIcon>
        </TitleSection>
        <DateRange>
          {formatDate(startDate)} ~ {formatDate(endDate)}
        </DateRange>
        <InfoSection>
          <ProgressItem>
            <ProgressIcon>✓</ProgressIcon>
            <ProgressText>하루 한번 인증</ProgressText>
          </ProgressItem>
        </InfoSection>

        {/* 프로그레스 바 추가 */}
        <ProgressBarContainer>
          <ProgressBarFill width={progressPercentage} />
        </ProgressBarContainer>

        <SuccessRate>
          {successCount}/{maxCount}
        </SuccessRate>
      </RightSection>
    </CardContainer>
  )
}

export default GroupChallengeParticipantCard

const CardContainer = styled.div`
  width: 322px;
  height: 130px;
  border-radius: 15px;
  background-color: ${theme.colors.lfWhite.base};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  //마우스 호버
  &:hover {
    transform: translateY(-2px);
  }
`

const LeftSection = styled.div`
  width: 130px;
  height: 100%;
  /* background-color: ${theme.colors.lfGreenMain.base}; */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
`

const ChallengeImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RightSection = styled.div`
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
`

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
`

const ArrowIcon = styled.span`
  color: #999;
  font-size: 18px;
`

const DateRange = styled.div`
  font-size: 11px;
  color: #666;
  margin-bottom: 8px;
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 14px;
`

const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #666;
`

const ProgressIcon = styled.span`
  margin-right: 5px;
  font-size: 12px;
`

const ProgressText = styled.span`
  font-size: 11px;
`

// 프로그레스 바 스타일 추가
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  position: absolute;
  bottom: 16px;
  left: 12px;
  width: calc(100% - 52px);
`

const ProgressBarFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #4caf50;
  border-radius: 3px;
  transition: width 0.3s ease;
`

const SuccessRate = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`
