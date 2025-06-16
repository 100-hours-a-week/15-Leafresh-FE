import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { FeedVerificationStatusType } from '@entities/challenge/type'
import { AchievementRecord } from '@features/challenge/api/participate/group-participant'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

interface ChallengeProps {
  className?: string
  imageUrl?: string
  title: string
  startDate: Date
  endDate: Date
  successCount: number
  maxCount: number
  record?: AchievementRecord[]
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
  record = [],
  onClick,
}: ChallengeProps): ReactNode => {
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const getColor = (status: FeedVerificationStatusType): string => {
    switch (status) {
      case 'SUCCESS':
        return `${theme.colors.lfGreenMain.base}` // 초록
      case 'FAILURE':
        return `${theme.colors.lfRed.base}` // 빨강
      case 'PENDING_APPROVE':
        return `${theme.colors.lfDarkGray.base}` // 진한 회색
      default:
        return `${theme.colors.lfLightGray.base}`
    }
  }

  const segments = Array.from({ length: maxCount }, (_, idx) => {
    const rec = record.find(r => r.day === idx + 1)
    return {
      color: rec ? getColor(rec.status) : `${theme.colors.lfLightGray.base}`, // 미인증은 회색
    }
  })

  return (
    <CardContainer className={className} onClick={onClick}>
      <LeftSection>
        <ChallengeImage src={imageUrl} alt={title} width={120} height={120} />
      </LeftSection>
      <RightSection>
        <TitleSection>
          <Title>{title}</Title>
          <ArrowIcon onClick={onClick} name='ChevronRight' size={18}>
            &gt;
          </ArrowIcon>
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

        <RateWrapper>
          {/* 프로그레스 바 추가 */}
          {/* <ProgressBarContainer>
            <ProgressBarFill width={progressPercentage} />
          </ProgressBarContainer> */}
          <SegmentedBar>
            {segments.map((seg, i) => (
              <Segment
                key={i}
                color={seg.color}
                hasBorder={i !== 0} // 첫 칸은 선 없음
              />
            ))}
          </SegmentedBar>

          <SuccessRate>
            {successCount}/{maxCount}
          </SuccessRate>
        </RateWrapper>
      </RightSection>
    </CardContainer>
  )
}

export default GroupChallengeParticipantCard

const CardContainer = styled.div`
  width: 100%;
  height: 130px;
  margin: 0 0 20px 0;
  border-radius: 15px;
  background-color: ${theme.colors.lfWhite.base};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  cursor: pointer;
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
  font-weight: ${theme.fontWeight.semiBold};
  margin: 0;
  color: ${theme.colors.lfBlack.base};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* 한 줄로 제한 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
`

const ArrowIcon = styled(LucideIcon)`
  color: ${theme.colors.lfBlack.base};
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
  margin-bottom: 10px;
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

const RateWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  text-align: center;
`

const SegmentedBar = styled.div`
  display: flex;
  width: 100%;
  height: 13px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
`

const Segment = styled.div<{ color: string; hasBorder: boolean }>`
  flex: 1;
  background-color: ${({ color }) => color};
  ${({ hasBorder }) => (hasBorder ? `border-left: 1px solid white;` : '')}
  transition: background-color 0.3s ease;
`

const SuccessRate = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`
