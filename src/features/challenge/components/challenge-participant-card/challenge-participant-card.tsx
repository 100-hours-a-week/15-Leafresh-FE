import { ReactNode } from 'react'

import Image from 'next/image'

import styled from '@emotion/styled'

import { FeedVerificationStatusType } from '@/entities/challenge/model'
import { AchievementRecord } from '@/entities/member/api'

import { LucideIcon } from '@/shared/components'
import { theme } from '@/shared/config'
import { extractDateFromISOInKST, getKstMidnightToUtcISOString } from '@/shared/lib'

interface ChallengeProps {
  className?: string
  imageUrl?: string
  title: string
  startDate: Date
  endDate: Date
  successCount: number
  maxCount: number
  record?: AchievementRecord[]
  imagePriority?: boolean
  onClick?: () => void
}

export const GroupChallengeParticipantCard = ({
  className,
  imageUrl = '',
  title,
  startDate,
  endDate,
  successCount,
  maxCount,
  record = [],
  imagePriority,
  onClick,
}: ChallengeProps): ReactNode => {
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

  const KSTstartDate = getKstMidnightToUtcISOString(startDate)
  const KSTendDate = getKstMidnightToUtcISOString(endDate)

  return (
    <CardContainer className={className} onClick={onClick}>
      <LeftSection>
        <ChallengeImage
          src={imageUrl}
          alt={title}
          fill
          sizes='(max-width: 900px) 33vw, 150px'
          priority={imagePriority}
        />
      </LeftSection>
      <RightSection>
        <TitleSection>
          <Title>{title}</Title>
          <ArrowIcon onClick={onClick} name='ChevronRight' size={18} />
        </TitleSection>
        <DateRange>
          {extractDateFromISOInKST(KSTstartDate)} ~ {extractDateFromISOInKST(KSTendDate)}
        </DateRange>
        <InfoSection>
          <ProgressItem>
            <ProgressIcon>✓</ProgressIcon>
            <ProgressText>하루 한번 인증</ProgressText>
          </ProgressItem>
        </InfoSection>

        <RateWrapper>
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

const CardContainer = styled.div`
  width: 100%;
  height: 130px;
  margin: 0 0 20px 0;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.lfWhite.base};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  cursor: pointer;
`

const LeftSection = styled.div`
  height: 100%;
  aspect-ratio: 1/1;
  /* background-color: ${theme.colors.lfGreenMain.base}; */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ChallengeImage = styled(Image)`
  object-fit: cover;
  transition: filter 0.2s ease;

  ${CardContainer}:hover & {
    filter: brightness(1.1);
  }
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
  text-align: center;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 6px;
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
  font-size: 14px;
  font-weight: 600;
  color: #333;
`
