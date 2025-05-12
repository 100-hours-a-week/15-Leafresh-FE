'use client'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { convertLanguage, DAY_PAIRS } from '@entities/challenge/constant'
import {
  getGroupChallengeRulesList,
  GroupChallengeRulesListResponse,
} from '@features/challenge/api/get-group-challenge-rules'
import {
  getPersonalChallengeRulesList,
  PersonalChallengeRulesListResponse,
} from '@features/challenge/api/get-personal-challenge-rules'
import ChallengeVerifyExamples from '@features/challenge/components/common/ChallengeVerifyExamples'
import Loading from '@shared/components/loading'
import { QUERY_KEYS } from '@shared/constants/tanstack-query/query-keys'
import { ChallengeDataType } from '@shared/context/modal/CameraModalStore'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

interface VerificationGuideModalProps {
  challengeData: ChallengeDataType
  onClose: () => void
}
const VerificationGuideModal = ({ challengeData, onClose }: VerificationGuideModalProps) => {
  const { id: challengeId, type } = challengeData

  type ChallengeRulesListResponse = GroupChallengeRulesListResponse | PersonalChallengeRulesListResponse
  let queryKey
  let queryFn
  switch (type) {
    case 'GROUP':
      queryKey = QUERY_KEYS.CHALLENGE.GROUP.RULES(challengeId)
      queryFn = () => getGroupChallengeRulesList(challengeId)
      break
    case 'PERSONAL':
      queryKey = QUERY_KEYS.CHALLENGE.PERSONAL.RULES(challengeId)
      queryFn = () => getPersonalChallengeRulesList(challengeId)
      break
  }
  const { data, isLoading, isError } = useQuery<ChallengeRulesListResponse>({
    queryKey: queryKey,
    queryFn: queryFn,
  })

  let contents
  if (isLoading) {
    contents = <Loading />
  }
  if (data) {
    const { certificationPeriod, exampleImages } = data.data

    let periodText = ''
    if (type === 'GROUP') {
      const groupPeriod = certificationPeriod as GroupChallengeRulesListResponse['data']['certificationPeriod']
      periodText = `${groupPeriod.startDate.slice(2)} ~ ${groupPeriod.endDate.slice(2)}`
    } else {
      const personalPeriod = certificationPeriod as PersonalChallengeRulesListResponse['data']['certificationPeriod']
      periodText = convertLanguage(DAY_PAIRS, 'eng', 'kor')(personalPeriod.dayOfWeek) as string
    }

    const timeText = `${certificationPeriod.startTime} ~ ${certificationPeriod.endTime}`

    const today = new Date()
    const todayString = today.toLocaleDateString('ko-KR', {
      weekday: 'long',
      month: '2-digit',
      day: '2-digit',
    })
    const todayLabel = `오늘 (${todayString.replace('.', '-').replace(' ', '').replace('월', '-').replace('일', '')})`

    contents = (
      <>
        <StyledChallengeVerifyExamples
          title='인증샷 예시 *'
          description='* 해당 인증샷은 실제 검증모델에 사용되지 않는 참고용 사진입니다.'
          maxCount={5}
          readOnly
          examples={
            exampleImages.map(e => ({
              url: e.imageUrl,
              description: e.description,
              type: e.type,
            })) ?? []
          }
          onChange={() => {}}
        />

        <InfoSection>
          <InfoTitle>챌린지 인증 정보</InfoTitle>
          <InfoItem>
            <LucideIcon name='Check' size={20} />
            <span>인증 가능 날짜</span>
            <strong>{periodText}</strong>
          </InfoItem>
          <InfoItem>
            <LucideIcon name='Check' size={20} />
            <span>인증 가능 시간</span>
            <strong>{timeText}</strong>
          </InfoItem>
          <InfoItem>
            <LucideIcon name='Check' size={20} />
            <span>인증 날짜</span>
            <strong>{todayLabel}</strong>
          </InfoItem>
        </InfoSection>
      </>
    )
  }

  return (
    <GuideWrapper>
      <GuideHeader>
        인증 방법
        <CloseButton onClick={onClose}>
          <LucideIcon name='X' size={24} />
        </CloseButton>
      </GuideHeader>
      <GuideContent>{contents}</GuideContent>
    </GuideWrapper>
  )
}
export default VerificationGuideModal

const GuideWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80%;
  border-top-left-radius: ${theme.radius.xl};
  border-top-right-radius: ${theme.radius.xl};
  background: ${theme.colors.lfWhite.base};
  box-shadow: ${theme.shadow.lfPrime};
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`

const GuideHeader = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
`

const GuideContent = styled.div`
  padding: 20px;
`

const StyledChallengeVerifyExamples = styled(ChallengeVerifyExamples)`
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.md};
`

const CloseButton = styled.button`
  position: absolute;
  right: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
`

const InfoSection = styled.div`
  border-top: 1px solid ${theme.colors.lfLightGray.base};
  margin-top: 24px;
  padding-top: 20px;
`

const InfoTitle = styled.h4`
  font-weight: ${theme.fontWeight.semiBold};
  font-size: ${theme.fontSize.md};
  margin-bottom: 16px;
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  margin-bottom: 12px;

  span {
    flex: 1;
  }

  strong {
    font-weight: ${theme.fontWeight.bold};
  }
`
