import { ReactNode } from 'react'

import { FeedVerificationStatusType } from '@/entities/challenge/model'
import { AchievementRecord } from '@/entities/member/api'

import { theme } from '@/shared/config'
import { extractDateFromISOInKST, getKstMidnightToUtcISOString } from '@/shared/lib'

import * as S from './styles'

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

export const GroupChallengeParticipantCard = ({
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
    <S.CardContainer className={className} onClick={onClick}>
      <S.LeftSection>
        <S.ChallengeImage src={imageUrl} alt={title} fill />
      </S.LeftSection>
      <S.RightSection>
        <S.TitleSection>
          <S.Title>{title}</S.Title>
          <S.ArrowIcon onClick={onClick} name='ChevronRight' size={18} />
        </S.TitleSection>
        <S.DateRange>
          {extractDateFromISOInKST(KSTstartDate)} ~ {extractDateFromISOInKST(KSTendDate)}
        </S.DateRange>
        <S.InfoSection>
          <S.ProgressItem>
            <S.ProgressIcon>✓</S.ProgressIcon>
            <S.ProgressText>하루 한번 인증</S.ProgressText>
          </S.ProgressItem>
        </S.InfoSection>

        <S.RateWrapper>
          <S.SegmentedBar>
            {segments.map((seg, i) => (
              <S.Segment
                key={i}
                color={seg.color}
                hasBorder={i !== 0} // 첫 칸은 선 없음
              />
            ))}
          </S.SegmentedBar>

          <S.SuccessRate>
            {successCount}/{maxCount}
          </S.SuccessRate>
        </S.RateWrapper>
      </S.RightSection>
    </S.CardContainer>
  )
}
