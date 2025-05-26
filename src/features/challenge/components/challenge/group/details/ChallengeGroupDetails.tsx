'use client'

import { differenceInCalendarDays } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { ChallengeVerificationStatusType } from '@entities/challenge/type'
import { useOAuthUserStore } from '@entities/member/context/OAuthUserStore'
import { getGroupChallengeDetails } from '@features/challenge/api/get-group-challenge-details'
import {
  ParticipateGroupChallengeResponse,
  ParticipateGroupChallengeVariables,
} from '@features/challenge/api/participate-group-challenge'
import ChallengeVerifyExamples, {
  VerificationImageData,
} from '@features/challenge/components/common/ChallengeVerifyExamples'
import BackButton from '@shared/components/Button/BackButton'
import DatePicker from '@shared/components/datepicker/DatePicker'
import Loading from '@shared/components/loading'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/useToast/useToast'
import { ErrorResponse } from '@shared/lib/api/fetcher/type'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import LeafIcon from '@public/icon/leaf.png'

import ChallengeVerifyCarousel from './ChallengeVerifyCarousel'

type WarningType = {
  isWarning: boolean
  value: string
}

const CHALLENGE_DETAILS_WARNINGS: WarningType[] = [
  { isWarning: false, value: '단체 챌린지는 재참여가 불가능합니다.' },
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
  const { userInfo } = useOAuthUserStore()
  const { openConfirmModal } = useConfirmModalStore()

  const isLoggedIn: boolean = userInfo && userInfo.isMember ? true : false

  const router = useRouter()
  const openToast = useToast()
  /** 단체 챌린지 상세 가져오기 */
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId),
    queryFn: () => getGroupChallengeDetails(challengeId),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.DETAILS,
  })

  /** 단체 챌린지 참여 이력 생성 */
  const { mutate: ParticipateMutate, isPending } = useMutationStore<
    ParticipateGroupChallengeResponse,
    ParticipateGroupChallengeVariables
  >(MUTATION_KEYS.CHALLENGE.GROUP.PARTICIPATE)

  if (isLoading || !data?.data) return <Loading />

  const challengeData = data.data
  const {
    thumbnailUrl,
    category,
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
    status,
  } = challengeData

  const totalDays = differenceInCalendarDays(endDate, startDate) + 1 /** 지속일 */
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

  /** 제출하기 */
  const handleSubmit = () => {
    /** 예외0 : disabled 무시하고 제출 */
    if (isButtonDisabled) {
      openToast(ToastType.Error, '챌린지에 재참여할 수 없습니다.')
      return
    }
    /** 로그인하지 않음 */
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }
    const now = new Date()

    const startDateTime = new Date(`${startDate}T${verificationStartTime}`)
    const endDateTime = new Date(`${endDate}T${verificationEndTime}`)

    /** #예외1 : 챌린지 기간이 아님 */
    if (now < startDateTime || now > endDateTime) {
      openToast(ToastType.Error, '챌린지 기간이 아닙니다!')
      return
    }

    const startTime = verificationStartTime.split(':').map(Number)
    const endTime = verificationEndTime.split(':').map(Number)
    const currentTime = [now.getHours(), now.getMinutes()]

    const currentMinutes = currentTime[0] * 60 + currentTime[1]
    const startMinutes = startTime[0] * 60 + startTime[1]
    const endMinutes = endTime[0] * 60 + endTime[1]

    /** #예외2 : 기간은 맞으나, 시간이 아님 */
    if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
      openToast(ToastType.Error, '참여 가능한 시간이 아닙니다')
      return
    }

    /** 제출하기 */
    ParticipateMutate(
      { challengeId },
      {
        onSuccess: () => {
          openToast(ToastType.Success, `참여 성공!\n인증 제출을 해주세요`) // 성공 메시지
          router.replace(URL.CHALLENGE.PARTICIPATE.INDEX.value) // 참여중인 챌린지로 이동
        },
        onError: (error: ErrorResponse) => {
          openToast(ToastType.Error, error.message)
        },
      },
    )
  }

  /** 단체 챌린지 참여 이력 페이지로 이동 */
  const handleRouteToVerificationsPage = () => {
    router.push(URL.CHALLENGE.GROUP.PARTICIPATE_LIST.value(challengeId))
  }
  return (
    <Wrapper className={className}>
      <DescriptionSection>
        <StyledBackButton onClick={() => router.push(URL.CHALLENGE.GROUP.LIST.value(category))} />
        <ThumbnailImageWrapper>
          <Thumbnail src={thumbnailUrl} alt='썸네일' fill />
        </ThumbnailImageWrapper>
        <Participant>
          <LucideIcon name='UsersRound' size={24} color='lfBlue' /> {currentParticipantCount}명 참여중
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
            startDate={new Date(startDate)}
            endDate={new Date(endDate)}
            setStartDate={() => {}}
            setEndDate={() => {}}
            readOnly
          />
          <TimeArea>
            <TimeText>
              매일, {totalDays}일간 {verificationStartTime} ~ {verificationEndTime} 인증하기
            </TimeText>
          </TimeArea>
        </Section>

        <Section>
          <StyledChallengeVerifyExamples
            title='인증샷 예시'
            description='* 해당 인증샷은 실제 검증모델에 사용되지 않는 참고용 사진입니다.'
            maxCount={5}
            examples={verificationExampleImages}
            onChange={() => {}}
            readOnly
            verificationInputClassName='verify-input'
          />
        </Section>

        <Section>
          <SectionTitle>
            <div>참여자 인증 사진</div>
            <MoreButton onClick={handleRouteToVerificationsPage}>더 보기</MoreButton>
          </SectionTitle>
          {verificationImages.length === 0 ? (
            <NoVerficiationImageText>아직 인증사진이 없습니다!</NoVerficiationImageText>
          ) : (
            <ChallengeVerifyCarousel images={verificationImages} />
          )}
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

      <SubmitButton onClick={handleSubmit} disabled={isButtonDisabled}>
        {!isPending ? getSubmitButtonLabel(status) : <Loading />}
      </SubmitButton>
    </Wrapper>
  )
}

export default ChallengeGroupDetails

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 0px;
`

const DescriptionSection = styled.section`
  margin-bottom: 45px;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ThumbnailImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 14/9;

  position: relative;
`

const Thumbnail = styled(Image)`
  width: 100%;
  object-fit: cover;
  border-radius: ${theme.radius.base};
`

const Participant = styled.div`
  padding: 14px 0;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlue.base};

  display: flex;
  align-items: center;
  gap: 5px;
`

const Descriptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Title = styled.h2`
  font-size: 30px;
  font-weight: ${theme.fontWeight.semiBold};
`
const Description = styled.p`
  font-size: ${theme.fontSize.base};
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
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

  margin-top: 18px;
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

const StyledBackButton = styled(BackButton)`
  position: absolute;
`

const NoVerficiationImageText = styled.div`
  text-align: center;
  padding: 30px;
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfRed.base};
`

// export const dummyGroupChallengeDetail: GroupChallengeDetail = {
//   id: 1,
//   isEvent: true,
//   category: 'ZERO_WASTE',
//   title: '클린 그릭',
//   description:
//     '챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...챌린지 설명...',
//   startDate: '2025-05-12' as DateFormatString,
//   endDate: '2025-05-14' as DateFormatString,
//   verificationStartTime: '00:00' as TimeFormatString,
//   verificationEndTime: '23:59' as TimeFormatString,
//   leafReward: 30,
//   thumbnailUrl: '/icon/category_zero_waste.png',
//   exampleImages: [
//     {
//       id: 1,
//       imageUrl: '/icon/category_zero_waste.png',
//       type: 'SUCCESS',
//       description: '성공 인증샷 설명 1',
//       sequenceNumber: 1,
//     },
//     {
//       id: 2,
//       imageUrl: '/icon/category_zero_waste.png',
//       type: 'SUCCESS',
//       description: '성공 인증샷 설명 2',
//       sequenceNumber: 2,
//     },
//     {
//       id: 3,
//       imageUrl: '/icon/category_zero_waste.png',
//       type: 'FAILURE',
//       description:
//         '실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명실패 인증샷 설명',
//       sequenceNumber: 3,
//     },
//     {
//       id: 4,
//       imageUrl: '/icon/category_zero_waste.png',
//       type: 'FAILURE',
//       description: '실패 인증샷 설명',
//       sequenceNumber: 4,
//     },
//   ],
//   verificationImages: [
//     '/icon/category_zero_waste.png',
//     '/icon/category_zero_waste.png',
//     '/icon/category_zero_waste.png',
//     '/icon/category_zero_waste.png',
//     '/icon/category_zero_waste.png',
//     '/icon/category_zero_waste.png',
//     '/icon/category_zero_waste.png',
//     '/icon/category_zero_waste.png',
//     '/icon/category_zero_waste.png',
//   ],
//   maxParticipantCount: 50,
//   currentParticipantCount: 24,
//   status: 'NOT_SUBMITTED',
// }
