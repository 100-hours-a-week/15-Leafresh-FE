'use client'

import Image from 'next/image'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { getGroupChallengeDetails, GroupChallengeDetail } from '@features/challenge/api/get-group-challenge-details'
import ChallengeVerifyExamples, {
  VerificationImageData,
} from '@features/challenge/components/common/ChallengeVerifyExamples'
import DatePicker from '@shared/components/datepicker/DatePicker'
import Loading from '@shared/components/loading'
import { QUERY_KEYS } from '@shared/constants/tanstack-query/query-keys'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import { DateFormatString, TimeFormatString } from '@shared/types/date'
import LeafIcon from '@public/icon/leaf.png'

import ChallengeVerifyCarousel from './ChallengeVerifyCarousel'

export const dummyGroupChallengeDetail: GroupChallengeDetail = {
  id: 1,
  isEvent: true,
  title: '클린 그릭',
  description:
    '챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...',
  startDate: '2025-05-12' as DateFormatString,
  endDate: '2025-05-14' as DateFormatString,
  verificationStartTime: '00:00' as TimeFormatString,
  verificationEndTime: '23:59' as TimeFormatString,
  leafReward: 30,
  thumbnailUrl: '/icon/category_zero_waste.png',
  exampleImages: [
    {
      id: 1,
      imageUrl: '/icon/category_zero_waste.png',
      type: 'SUCCESS',
      description: '성공 인증샷 설명 1',
      sequenceNumber: 1,
    },
    {
      id: 2,
      imageUrl: '/icon/category_zero_waste.png',
      type: 'SUCCESS',
      description: '성공 인증샷 설명 2',
      sequenceNumber: 2,
    },
    {
      id: 3,
      imageUrl: '/icon/category_zero_waste.png',
      type: 'FAILURE',
      description: '실패 인증샷 설명',
      sequenceNumber: 3,
    },
    {
      id: 4,
      imageUrl: '/icon/category_zero_waste.png',
      type: 'FAILURE',
      description: '실패 인증샷 설명',
      sequenceNumber: 4,
    },
  ],
  verificationImages: [
    '/icon/category_zero_waste.png',
    '/icon/category_zero_waste.png',
    '/icon/category_zero_waste.png',
    '/icon/category_zero_waste.png',
    '/icon/category_zero_waste.png',
    '/icon/category_zero_waste.png',
    '/icon/category_zero_waste.png',
    '/icon/category_zero_waste.png',
    '/icon/category_zero_waste.png',
  ],
  maxParticipantCount: 50,
  currentParticipantCount: 24,
  status: 'NOT_SUBMITTED',
}

type WarningType = {
  isWarning: boolean
  value: string
}

const CHALLENGE_DETAILS_WARNINGS: WarningType[] = [
  { isWarning: false, value: '개인 챌린지는 재참여가 불가능합니다.' },
  { isWarning: false, value: '인증 참여가 아닌, 성공시 나뭇잎이 부여됩니다.' },
  { isWarning: false, value: '인증 여부는 AI가 판단합니다.' },
  { isWarning: false, value: '인증 사진은 모든 사용자에게 공개됩니다.' },
  { isWarning: true, value: '부적절한 인증 사진은 관리자에 의해 삭제될 수 있습니다.' },
]

interface ChallengeGroupDetailsProps {
  challengeId: number
  className?: string
}

const ChallengeGroupDetails = ({ challengeId, className }: ChallengeGroupDetailsProps) => {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId),
    queryFn: () => getGroupChallengeDetails(challengeId),
  })

  if (isLoading || !data?.data) return <Loading />

  /** TODO: DB에 데이터가 채워지면 해당 상수로 교체 */
  //  const challengeData = data.data
  const challengeData = dummyGroupChallengeDetail
  const {
    thumbnailUrl,
    title,
    description,
    currentParticipantCount,
    exampleImages,
    verificationImages,
    startDate,
    endDate,
    verificationStartTime,
    verificationEndTime,
    leafReward,
  } = challengeData

  const verificationExampleImages: VerificationImageData[] = exampleImages.map(img => ({
    url: img.imageUrl,
    description: img.description,
    type: img.type,
  }))

  return (
    <Wrapper className={className}>
      <DescriptionSection>
        <Thumbnail src={thumbnailUrl} alt='썸네일' width={500} height={200} />
        <Participant>
          <LucideIcon name='UserRound' size={15} fill='lfBlack' /> {currentParticipantCount}명 참여중
        </Participant>

        <Descriptions>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Descriptions>
      </DescriptionSection>

      <SectionWrapper>
        <Section>
          <SectionTitle>인증 방법</SectionTitle>
          <WarningList>
            <Warning isWarning={false}>
              <LucideIcon name='Check' size={24} />
              <li>인증샷 예시에 맞는 사진 제출</li>
            </Warning>
            <Warning isWarning={false}>
              <LucideIcon name='Check' size={24} />
              <li>AI가 사진분석을 통해 인증 성공 여부 판단</li>
            </Warning>
            <Warning isWarning={false}>
              <LucideIcon name='Check' size={24} />
              <li style={{ display: 'flex', alignItems: 'center' }}>
                인증 성공시 <Image src={LeafIcon} alt='나뭇잎 아이콘' /> {leafReward}개 지급
              </li>
            </Warning>
          </WarningList>
        </Section>

        <Section>
          <StyledDatePicker
            icon={<LucideIcon name='CalendarDays' size={24} />}
            label='인증 기간'
            startDate={new Date('2025-05-12')}
            endDate={new Date('2025-05-14')}
            setStartDate={() => {}}
            setEndDate={() => {}}
            readOnly
          />
          <TimeArea>
            <TimeText>
              {verificationStartTime} ~ {verificationEndTime} 공유하기
            </TimeText>
          </TimeArea>
        </Section>

        <Section>
          <StyledChallengeVerifyExamples
            title='인증샷 예시'
            description=''
            maxCount={5}
            examples={verificationExampleImages}
            onChange={() => {}}
            readOnly
          />
        </Section>

        <Section>
          <SectionTitle>
            <div>참여자 인증 사진</div>
            <MoreButton onClick={() => {}}>더 보기</MoreButton>
          </SectionTitle>
          <ChallengeVerifyCarousel images={verificationImages} />
        </Section>

        <Section>
          <SectionTitle>유의사항</SectionTitle>
          <WarningList>
            {CHALLENGE_DETAILS_WARNINGS.map(warnings => (
              <Warning key={warnings.value} isWarning={warnings.isWarning}>
                <LucideIcon name='Check' size={24} />
                <li>{warnings.value}</li>
              </Warning>
            ))}
          </WarningList>
        </Section>
      </SectionWrapper>

      <SubmitButton>참여하기</SubmitButton>
    </Wrapper>
  )
}

export default ChallengeGroupDetails

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 16px;
`

const DescriptionSection = styled.section`
  margin-bottom: 45px;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Thumbnail = styled(Image)`
  width: 100%;
  aspect-ratio: 14/9;

  border-radius: ${theme.radius.base};
`

const Participant = styled.div`
  padding: 14px 0;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};

  display: flex;
  align-items: center;
  gap: 4px;
`

const Descriptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Title = styled.h2`
  font-size: 30px;
  font-weight: ${theme.fontWeight.semiBold};
`
const Description = styled.p`
  font-size: ${theme.fontSize.base};
  white-space: pre-wrap;
  word-break: break-word;
`

const MoreButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.lfBlue.base};
  background: none;
  border: none;
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
`

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;

  gap: 12px;
`

const SectionTitle = styled.div`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semiBold};

  position: relative;
`

const StyledDatePicker = styled(DatePicker)`
  font-weight: ${theme.fontWeight.semiBold};
  font-size: ${theme.fontSize.md};
`

const TimeArea = styled.div`
  background-color: ${theme.colors.lfInputBackground.base};
  border-radius: ${theme.radius.sm};

  padding: 30px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TimeText = styled.span`
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.base};
`

const StyledChallengeVerifyExamples = styled(ChallengeVerifyExamples)`
  font-weight: ${theme.fontWeight.semiBold};
`

const SubmitButton = styled.button`
  padding: 12px;
  border-radius: ${theme.radius.base};
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  font-weight: ${theme.fontWeight.semiBold};
  cursor: pointer;
  border: none;
`

const WarningList = styled.ul`
  margin-top: 5px;

  font-size: ${theme.fontSize.base};
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Warning = styled.div<{ isWarning: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;

  font-weight: ${theme.fontWeight.medium};
  color: ${({ isWarning }) => (isWarning ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};
`
