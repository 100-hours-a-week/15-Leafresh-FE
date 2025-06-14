import { ReactNode } from 'react'

import { ChallengeProps } from '../model/types'
import * as S from './styles'

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
    <S.CardContainer className={className} onClick={onClick}>
      <S.LeftSection>
        <S.ChallengeImage src={imageUrl} alt={title} width={120} height={120} />
      </S.LeftSection>
      <S.RightSection>
        <S.TitleSection>
          <S.Title>{title}</S.Title>
          <S.ArrowIcon onClick={onClick} name='ChevronRight' size={18}>
            &gt;
          </S.ArrowIcon>
        </S.TitleSection>
        <S.DateRange>
          {formatDate(startDate)} ~ {formatDate(endDate)}
        </S.DateRange>
        <S.InfoSection>
          <S.ProgressItem>
            <S.ProgressIcon>✓</S.ProgressIcon>
            <S.ProgressText>하루 한번 인증</S.ProgressText>
          </S.ProgressItem>
        </S.InfoSection>

        {/* 프로그레스 바 추가 */}
        <S.ProgressBarContainer>
          <S.ProgressBarFill width={progressPercentage} />
        </S.ProgressBarContainer>

        <S.SuccessRate>
          {successCount}/{maxCount}
        </S.SuccessRate>
      </S.RightSection>
    </S.CardContainer>
  )
}

export default GroupChallengeParticipantCard
