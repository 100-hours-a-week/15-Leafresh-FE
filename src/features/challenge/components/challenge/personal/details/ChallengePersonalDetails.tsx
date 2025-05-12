'use client'

import Image from 'next/image'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { ChallengeVerificationStatusType } from '@entities/challenge/type'
import {
  getPersonalChallengeDetails,
  PersonalChallengeDetail,
} from '@features/challenge/api/get-personal-challenge-details'
import ChallengeVerifyExamples, {
  VerificationImageData,
} from '@features/challenge/components/common/ChallengeVerifyExamples'
import Loading from '@shared/components/loading'
import { QUERY_KEYS } from '@shared/constants/tanstack-query/query-keys'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import { TimeFormatString } from '@shared/types/date'
import LeafIcon from '@public/icon/leaf.png'

export const dummyPersonalChallengeDetail: PersonalChallengeDetail = {
  id: 1,
  title: '제로 웨이스트 실천하기',
  description:
    '하루 동안 일회용품 사용을 줄이고, 텀블러와 장바구니를 활용해보세요.\n실천하는 모습의 인증샷을 업로드해주세요!',
  thumbnailUrl: '/icon/category_zero_waste.png',
  dayOfWeek: 'MONDAY',
  verificationStartTime: '08:00' as TimeFormatString,
  verificationEndTime: '22:00' as TimeFormatString,
  leafReward: 15,
  exampleImages: [
    {
      id: 1,
      imageUrl: '/icon/category_zero_waste.png',
      type: 'SUCCESS',
      description: '텀블러 사용 장면',
      sequenceNumber: 1,
    },
    {
      id: 2,
      imageUrl: '/icon/category_zero_waste.png',
      type: 'SUCCESS',
      description: '장바구니 사용 장면',
      sequenceNumber: 2,
    },
    {
      id: 3,
      imageUrl: '/icon/category_zero_waste.png',
      type: 'FAILURE',
      description: '일회용 컵을 사용한 장면',
      sequenceNumber: 3,
    },
  ],
  status: 'NOT_SUBMITTED',
}

type WarningType = {
  isWarning: boolean
  value: string
}

const CHALLENGE_DETAILS_WARNINGS: WarningType[] = [
  { isWarning: false, value: '개인 챌린지는 재참여가 불가합니다.' },
  { isWarning: false, value: '인증 참여가 아닌, 성공시 나뭇잎이 부여됩니다.' },
  { isWarning: false, value: '인증 여부는 챌린지 생성자가 아닌, AI가 판단합니다.' },
  { isWarning: false, value: '개인 챌린지 인증 사진은 비공개 상태로 관리됩니다.' },
  { isWarning: true, value: '부적절한 인증 사진은 관리자에 의해 삭제될 수 있습니다.' },
]

interface ChallengePersonalDetailsProps {
  challengeId: number
  className?: string
}

const ChallengePersonalDetails = ({ challengeId, className }: ChallengePersonalDetailsProps): ReactNode => {
  // const router = useRouter()
  // const openToast = useToast()

  /** 개인 챌린지 상세 가져오기 */
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.DETAILS(challengeId),
    queryFn: () => getPersonalChallengeDetails(challengeId),
  })

  /** 개인 챌린지 인증 제출 페이지로 이동 */

  if (isLoading || !data?.data) return <Loading />

  /** TODO: DB에 데이터가 채워지면 해당 상수로 교체 */
  //  const challengeData = data.data
  const challengeData = dummyPersonalChallengeDetail
  const {
    id,
    thumbnailUrl,
    title,
    description,
    dayOfWeek,
    exampleImages,
    verificationStartTime,
    verificationEndTime,
    leafReward,
    status,
  } = challengeData

  const verificationExampleImages: VerificationImageData[] = exampleImages.map(img => ({
    url: img.imageUrl,
    description: img.description,
    type: img.type,
  }))

  /** 제출 버튼 비활성화 여부 */
  const isButtonDisabled: boolean = status !== 'NOT_SUBMITTED'
  const getSubmitButtonLabel = (status: ChallengeVerificationStatusType): string => {
    if (status === 'PENDING_APPROVAL') return '인증여부 판단 중'
    if (status === 'SUCCESS' || status === 'FAILURE' || status === 'DONE') return '참여 완료'
    return '참여하기'
  }

  /** 이미지 촬영 모달 열기 */
  const openImageModal = () => {}
  /** 제출하기 */
  // const handleSubmit = () => {
  //   /** 예외0 : disabled 무시하고 제출 */
  //   if (isButtonDisabled) {
  //     openToast(ToastType.Error, '챌린지에 재참여할 수 없습니다.')
  //     return
  //   }
  //   const now = new Date()

  //   const startDateTime = new Date(`${startDate}T${verificationStartTime}`)
  //   const endDateTime = new Date(`${endDate}T${verificationEndTime}`)

  //   /** #예외1 : 챌린지 기간이 아님 */
  //   if (now < startDateTime || now > endDateTime) {
  //     openToast(ToastType.Error, '챌린지 기간이 아닙니다!')
  //     return
  //   }

  //   const startTime = verificationStartTime.split(':').map(Number)
  //   const endTime = verificationEndTime.split(':').map(Number)
  //   const currentTime = [now.getHours(), now.getMinutes()]

  //   const currentMinutes = currentTime[0] * 60 + currentTime[1]
  //   const startMinutes = startTime[0] * 60 + startTime[1]
  //   const endMinutes = endTime[0] * 60 + endTime[1]

  //   /** #예외2 : 기간은 맞으나, 시간이 아님 */
  //   if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
  //     openToast(ToastType.Error, '참여 가능한 시간이 아닙니다')
  //     return
  //   }

  //   /** 이미지 촬영 모달 열기 */
  //   // ParticipateMutate(challengeId)
  // }

  return (
    <Wrapper className={className}>
      <DescriptionSection>
        <Thumbnail src={thumbnailUrl} alt='썸네일' width={500} height={200} />

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

          <TimeArea>
            <TimeText>
              오늘, {verificationStartTime} ~ {verificationEndTime} 공유하기
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
            verificationInputClassName='verify-input'
          />
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

      <SubmitButton onClick={openImageModal} disabled={isButtonDisabled}>
        {getSubmitButtonLabel(status)}
      </SubmitButton>
    </Wrapper>
  )
}

export default ChallengePersonalDetails

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

const Descriptions = styled.div`
  margin-top: 20px;
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

const TimeArea = styled.div`
  background-color: ${theme.colors.lfInputBackground.base};
  border-radius: ${theme.radius.sm};

  margin-top: 16px;
  padding: 30px;
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

  .verify-input {
    width: 40%;
  }
`

const SubmitButton = styled.button`
  /* padding: 12px; */
  height: 50px;
  border-radius: ${theme.radius.base};
  background-color: ${({ disabled }) => (disabled ? theme.colors.lfGreenInactive.base : theme.colors.lfGreenMain.base)};
  color: ${({ disabled }) => (disabled ? theme.colors.lfBlack.base : theme.colors.lfWhite.base)};
  font-weight: ${theme.fontWeight.semiBold};

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: none;

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? theme.colors.lfGreenInactive.base : theme.colors.lfGreenMain.hover};
  }
`

const WarningList = styled.ul`
  margin-top: 5px;

  font-size: ${theme.fontSize.base};
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const Warning = styled.div<{ isWarning: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;

  font-weight: ${theme.fontWeight.medium};
  color: ${({ isWarning }) => (isWarning ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};
`
