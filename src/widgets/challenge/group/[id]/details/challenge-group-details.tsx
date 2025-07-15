'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import { differenceInCalendarDays } from 'date-fns'

import {
  ChallengeVerifyCarousel,
  ChallengeVerifyExamples,
  VerificationImageData,
} from '@/features/challenge/components'

import {
  getGroupChallengeDetails,
  ParticipateGroupChallengeResponse,
  ParticipateGroupChallengeVariables,
} from '@/entities/challenge/api'
import { ChallengeVerificationStatusType } from '@/entities/challenge/model'

import LeafIcon from '@/shared/assets/icon/leaf.svg'
import { BackButton, DatePicker, Loading, LucideIcon } from '@/shared/components'
import { MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, theme, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { ToastType, useConfirmModalStore } from '@/shared/context'
import { useAuth, useToast } from '@/shared/hooks'
import { responsiveHorizontalPadding } from '@/shared/styles'

type WarningType = {
  isWarning: boolean
  value: string
}

const CHALLENGE_DETAILS_WARNINGS: WarningType[] = [
  { isWarning: false, value: '인증 여부는 AI가 판단합니다.' },
  { isWarning: false, value: '인증 참여가 아닌, 성공시 나뭇잎이 부여됩니다.' },
  { isWarning: false, value: '챌린지는 당일 재참여가 불가능합니다.' },
  { isWarning: false, value: '인증 사진은 모든 사용자에게 공개됩니다.' },
  { isWarning: true, value: '부적절한 인증 사진은 삭제 조치될 수 있습니다.' },
]

interface ChallengeGroupDetailsProps {
  challengeId: number
  className?: string
}

export const ChallengeGroupDetails = ({ challengeId, className }: ChallengeGroupDetailsProps) => {
  const { isLoggedIn } = useAuth()
  const { openConfirmModal } = useConfirmModalStore()

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

  const totalDays = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1 /** 지속일 */
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
    const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const localStartDate: Date = new Date(startDate)
    const startDateOnly = new Date(localStartDate.getFullYear(), localStartDate.getMonth(), localStartDate.getDate())

    const localEndDate: Date = new Date(endDate)
    const endDateOnly = new Date(localEndDate.getFullYear(), localEndDate.getMonth(), localEndDate.getDate())

    // 1. 오늘이 챌린지 날짜 범위 내에 있는지 확인
    if (todayDateOnly < startDateOnly || todayDateOnly > endDateOnly) {
      openToast(ToastType.Error, '챌린지 진행 기간이 아닙니다!')
      return
    }

    // 2. 현재 시간이 인증 가능 시간 범위 내에 있는지 확인
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    const [startHour, startMinute] = verificationStartTime.split(':').map(Number)
    const [endHour, endMinute] = verificationEndTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute

    if (nowMinutes < startMinutes || nowMinutes > endMinutes) {
      openToast(ToastType.Error, '현재는 인증 가능한 시간이 아닙니다!')
      return
    }

    /** 제출하기 */
    ParticipateMutate(
      { challengeId },
      {
        onSuccess: () => {
          openToast(ToastType.Success, `참여 성공!\n인증 제출을 해주세요`) // 성공 메시지
          router.replace(URL.MEMBER.CHALLENGE.PARTICIPATE.LIST.value) // 참여중인 챌린지로 이동
        },
      },
    )
  }

  /** 단체 챌린지 참여 이력 페이지로 이동 */
  const handleRouteToVerificationsPage = () => {
    router.push(URL.CHALLENGE.GROUP.VERIFICATION.LIST.value(challengeId))
  }
  return (
    <Wrapper className={className}>
      <DescriptionSection>
        <StyledBackButton onClick={() => router.push(URL.CHALLENGE.GROUP.LIST.value(category))} />
        <ThumbnailImageWrapper>
          <Thumbnail src={thumbnailUrl} alt='썸네일' fill sizes='(max-width: 900px) 100vw, 400px' priority />
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
                인증 성공시 <LeafIcon width={24} height={24} style={{ margin: '0 6px' }} /> {leafReward}개 지급
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
        {!isPending ? getSubmitButtonLabel(status) : <Loading hasText={false} />}
      </SubmitButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${responsiveHorizontalPadding};

  display: flex;
  flex-direction: column;
  gap: 24px;
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
