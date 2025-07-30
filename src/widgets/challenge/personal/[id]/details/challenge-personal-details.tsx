'use client'

import { ReactNode } from 'react'

import { useRouter } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { VerificationImageData } from '@/features/challenge/components'

import {
  getPersonalChallengeDetails,
  VerifyGroupChallengeResponse,
  VerifyPersonalChallengeBody,
  VerifyVariables,
} from '@/entities/challenge/api'
import { ChallengeVerificationStatusType } from '@/entities/challenge/model'

import { Loading, LucideIcon } from '@/shared/components'
import { MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { useCameraModalStore, useConfirmModalStore, usePollingStore, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'
import { DayType } from '@/shared/lib'

import * as S from './styles'

type WarningType = {
  isWarning: boolean
  value: string
}

const CHALLENGE_DETAILS_WARNINGS: WarningType[] = [
  { isWarning: false, value: '인증 여부는 챌린지 생성자가 아닌, AI가 판단합니다.' },
  { isWarning: false, value: '인증 참여가 아닌, 성공시 나뭇잎이 부여됩니다.' },
  { isWarning: false, value: '챌린지는 당일 재참여가 불가능합니다.' },
  { isWarning: false, value: '개인 챌린지 인증 사진은 비공개 상태로 관리됩니다.' },
  { isWarning: true, value: '부적절한 인증 사진은 삭제 조치될 수 있습니다.' },
]

interface ChallengePersonalDetailsProps {
  challengeId: number
  className?: string
}

export const ChallengePersonalDetails = ({ challengeId, className }: ChallengePersonalDetailsProps): ReactNode => {
  const router = useRouter()
  const { toast } = useToast()
  const { open: openCameraModal } = useCameraModalStore()
  const { isLoggedIn } = useUserStore()
  const { openConfirmModal } = useConfirmModalStore()

  const { addPersonalChallengeId } = usePollingStore()

  /** 개인 챌린지 상세 가져오기 */
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.DETAILS(challengeId),
    queryFn: () => getPersonalChallengeDetails(challengeId),
    ...QUERY_OPTIONS.CHALLENGE.PERSONAL.DETAILS,
  })

  /** 개인 챌린지 인증 생성 (제출) */
  const { mutate: VerifyMutate, isPending } = useMutationStore<VerifyGroupChallengeResponse, VerifyVariables>(
    MUTATION_KEYS.CHALLENGE.PERSONAL.VERIFICATION.SUBMIT,
  )

  if (isLoading || !data?.data) return <Loading />

  const challengeData = data.data

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
    let label: string = ''
    switch (status) {
      // TODO: 인증이 올바르게 AI펍섭에 들어가지 않은 경우 핸들링 필요 (협업)
      case 'PENDING_APPROVAL':
        label = '인증여부 판단 중'
        break
      case 'SUCCESS':
        label = '오늘 인증 성공'
        break
      case 'FAILURE':
        label = '오늘 인증 실패'
        break
      case 'NOT_SUBMITTED': // 인증을 하지 않은 경우
        label = '인증하기'
        break
    }
    return label
  }

  /** 이미지 촬영 모달 열기 */
  const openImageModal = () => {
    // #0. 로그인 상태가 아닐 때
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value()),
      })
      return
    }
    openCameraModal(
      // #1. 카메라 모달 제목
      `${title} 챌린지`,

      // #2. 이미지 + (설명) 업로드 처리
      ({ imageUrl, description }) => handleSubmit(imageUrl, description),

      // #3. 이미지에 대한 설명을 받을지 여부
      true,

      // #4. 어떤 인증인지 여부
      'DONE' /** TODO: SUCCESS / FAILURE가 아닌걸로 설정하기 위해 더미값 넣어둠, 구별 필요 */,

      // #5. 챌린지 정보 명시
      {
        id: challengeId,
        type: 'PERSONAL',
      },
    )
  }
  /** 제출하기 */
  const handleSubmit = (imageUrl: string, description: string | undefined) => {
    if (!imageUrl || !description) return

    /** #예외1: 챌린지에 이미 참여한 경우 */
    if (status !== 'NOT_SUBMITTED') {
      toast('Error', '챌린지에 재참여할 수 없습니다.')
      return
    }

    const now = new Date()

    /** #예외2: 요일이 일치하지 않으면 참여 불가 */
    const nowDay: DayType = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() as DayType // e.g. 'MONDAY'
    if (nowDay !== dayOfWeek) {
      toast('Error', '챌린지 기간이 아닙니다')
      return
    }

    /** #예외3: 참여 가능한 시간이 아닐 경우 */
    const [startH, startM] = verificationStartTime.split(':').map(Number)
    const [endH, endM] = verificationEndTime.split(':').map(Number)
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    if (nowMinutes < startMinutes || nowMinutes > endMinutes) {
      toast('Error', '참여 가능한 시간이 아닙니다')
      return
    }

    /** 예외 없음 → 인증 제출 */
    const body: VerifyPersonalChallengeBody = {
      imageUrl,
      content: description,
    }

    VerifyMutate(
      {
        challengeId,
        body,
      },
      {
        onSuccess: () => {
          addPersonalChallengeId(challengeId) // 인증 결과 롱폴링 시작
          toast('Success', `제출 성공!\nAI 판독 결과를 기다려주세요`) // 성공 메시지
        },
      },
    )
  }

  return (
    <S.Wrapper className={className}>
      <S.DescriptionSection>
        <S.ThumbnailImageWrapper>
          <S.Thumbnail src={thumbnailUrl} alt='썸네일' fill sizes='(max-width: 430px) 100vw, 400px' priority />
        </S.ThumbnailImageWrapper>

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
                인증 성공시 <S.StyledLeafReward reward={leafReward} />개 지급
              </li>
            </S.Warning>
          </S.WarningList>

          <S.TimeArea>
            <S.TimeText>
              오늘, {verificationStartTime} ~ {verificationEndTime} 인증하기
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

      <S.SubmitButton onClick={openImageModal} disabled={isButtonDisabled}>
        {!isPending ? getSubmitButtonLabel(status) : <Loading hasText={false} />}
      </S.SubmitButton>
    </S.Wrapper>
  )
}
