'use client'

import { differenceInCalendarDays } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { getGroupChallengeDetails } from '@entities/challenge/api/group/get-group-details'
import {
  ParticipateGroupChallengeResponse,
  ParticipateGroupChallengeVariables,
} from '@entities/challenge/api/group/participate/participate-group'
import { ChallengeVerificationStatusType } from '@entities/common/type'
import ChallengeVerifyCarousel from '@features/challenge/components/challenge/group/details/ChallengeVerifyCarousel'
import { VerificationImageData } from '@features/challenge/components/common/ChallengeVerifyExamples'
import Loading from '@shared/components/loading/ui/loading'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import LeafIcon from '@public/icon/leaf.png'

import { CHALLENGE_DETAILS_WARNINGS } from '../model/constants'
import { ChallengeGroupDetailsPageProps } from '../model/types'
import * as S from './styles'

import { useQuery } from '@tanstack/react-query'

export const ChallengeGroupDetailsPage = ({ challengeId, className }: ChallengeGroupDetailsPageProps) => {
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
    <S.Wrapper className={className}>
      <S.DescriptionSection>
        <S.StyledBackButton onClick={() => router.push(URL.CHALLENGE.GROUP.LIST.value(category))} />
        <S.ThumbnailImageWrapper>
          <S.Thumbnail src={thumbnailUrl} alt='썸네일' fill />
        </S.ThumbnailImageWrapper>
        <S.Participant>
          <LucideIcon name='UsersRound' size={24} color='lfBlue' /> {currentParticipantCount}명 참여중
        </S.Participant>

        <S.Descriptions>
          <S.Title>{title}</S.Title>
          <S.Description>{description}</S.Description>
        </S.Descriptions>
      </S.DescriptionSection>

      <S.SectionWrapper>
        <S.Section>
          <S.SectionTitle>인증 방법</S.SectionTitle>
          <S.WarningList>
            <S.Warning isWarning={false}>
              <LucideIcon name='Check' size={24} />
              <li>인증샷 예시에 맞는 사진 제출</li>
            </S.Warning>
            <S.Warning isWarning={false}>
              <LucideIcon name='Check' size={24} />
              <li>AI가 사진분석을 통해 인증 성공 여부 판단</li>
            </S.Warning>
            <S.Warning isWarning={false}>
              <LucideIcon name='Check' size={24} />
              <li style={{ display: 'flex', alignItems: 'center' }}>
                인증 성공시 <Image src={LeafIcon} alt='나뭇잎 아이콘' /> {leafReward}개 지급
              </li>
            </S.Warning>
          </S.WarningList>
        </S.Section>

        <S.Section>
          <S.StyledDatePicker
            icon={<LucideIcon name='CalendarDays' size={24} />}
            label='인증 기간'
            startDate={new Date(startDate)}
            endDate={new Date(endDate)}
            setStartDate={() => {}}
            setEndDate={() => {}}
            readOnly
          />
          <S.TimeArea>
            <S.TimeText>
              매일, {totalDays}일간 {verificationStartTime} ~ {verificationEndTime} 인증하기
            </S.TimeText>
          </S.TimeArea>
        </S.Section>

        <S.Section>
          <S.StyledChallengeVerifyExamples
            title='인증샷 예시'
            description='* 해당 인증샷은 실제 검증모델에 사용되지 않는 참고용 사진입니다.'
            maxCount={5}
            examples={verificationExampleImages}
            onChange={() => {}}
            readOnly
            verificationInputClassName='verify-input'
          />
        </S.Section>

        <S.Section>
          <S.SectionTitle>
            <div>참여자 인증 사진</div>
            <S.MoreButton onClick={handleRouteToVerificationsPage}>더 보기</S.MoreButton>
          </S.SectionTitle>
          {verificationImages.length === 0 ? (
            <S.NoVerficiationImageText>아직 인증사진이 없습니다!</S.NoVerficiationImageText>
          ) : (
            <ChallengeVerifyCarousel images={verificationImages} />
          )}
        </S.Section>

        <S.Section>
          <S.SectionTitle>유의사항</S.SectionTitle>
          <S.WarningList>
            {CHALLENGE_DETAILS_WARNINGS.map(warnings => (
              <S.Warning key={warnings.value} isWarning={warnings.isWarning}>
                <LucideIcon name='Check' size={24} />
                <li>{warnings.value}</li>
              </S.Warning>
            ))}
          </S.WarningList>
        </S.Section>
      </S.SectionWrapper>

      <S.SubmitButton onClick={handleSubmit} disabled={isButtonDisabled}>
        {!isPending ? getSubmitButtonLabel(status) : <Loading />}
      </S.SubmitButton>
    </S.Wrapper>
  )
}

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
