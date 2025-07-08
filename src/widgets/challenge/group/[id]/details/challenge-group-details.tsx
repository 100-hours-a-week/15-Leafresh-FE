'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'
import { differenceInCalendarDays } from 'date-fns'

import { ChallengeVerifyCarousel, VerificationImageData } from '@/features/challenge/components'

import {
  getGroupChallengeDetails,
  ParticipateGroupChallengeResponse,
  ParticipateGroupChallengeVariables,
} from '@/entities/challenge/api'
import { ChallengeVerificationStatusType } from '@/entities/challenge/model'

import { Loading, LucideIcon } from '@/shared/components'
import { MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { useConfirmModalStore, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'

import LeafIcon from '@public/icon/leaf.png'

import * as S from './styles'

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
  const { isLoggedIn } = useUserStore()
  const { openConfirmModal } = useConfirmModalStore()

  const router = useRouter()
  const { toast } = useToast()
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
      toast('Error', '챌린지에 재참여할 수 없습니다.')
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
      toast('Error', '챌린지 진행 기간이 아닙니다!')
      return
    }

    // 2. 현재 시간이 인증 가능 시간 범위 내에 있는지 확인
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    const [startHour, startMinute] = verificationStartTime.split(':').map(Number)
    const [endHour, endMinute] = verificationEndTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute

    if (nowMinutes < startMinutes || nowMinutes > endMinutes) {
      toast('Error', '현재는 인증 가능한 시간이 아닙니다!')
      return
    }

    /** 제출하기 */
    ParticipateMutate(
      { challengeId },
      {
        onSuccess: () => {
          toast('Success', `참여 성공!\n인증 제출을 해주세요`) // 성공 메시지
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
        {!isPending ? getSubmitButtonLabel(status) : <Loading hasText={false} />}
      </S.SubmitButton>
    </S.Wrapper>
  )
}
