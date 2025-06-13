'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

import {
  getPersonalChallengeDetails,
  PersonalChallengeDetail,
} from '@entities/challenge/api/get-personal-challenge-details'
import {
  VerifyGroupChallengeResponse,
  VerifyPersonalChallengeBody,
  VerifyVariables,
} from '@entities/challenge/api/verify-personal-challenge'
import { ChallengeVerificationStatusType, DayType } from '@entities/challenge/model/type'
import { VerificationImageData } from '@features/challenge/components/common/ChallengeVerifyExamples'
import Loading from '@shared/components/loading'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { useCameraModalStore } from '@shared/context/modal/CameraModalStore'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { TimeFormatString } from '@shared/types/date'
import LeafIcon from '@public/icon/leaf.png'

import { CHALLENGE_DETAILS_WARNINGS } from '../model/constants'
import { ChallengePersonalDetailsProps } from '../model/types'
import * as S from './styles'

import { useQuery } from '@tanstack/react-query'

// TODO: /entities로 더미데이터 분리
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

export const ChallengePersonalDetails = ({ challengeId, className }: ChallengePersonalDetailsProps): ReactNode => {
  const router = useRouter()
  const openToast = useToast()
  const { open: openCameraModal } = useCameraModalStore()
  const { isLoggedIn } = useAuth()
  const { openConfirmModal } = useConfirmModalStore()

  /** 개인 챌린지 상세 가져오기 */
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.DETAILS(challengeId),
    queryFn: () => getPersonalChallengeDetails(challengeId),
    ...QUERY_OPTIONS.CHALLENGE.PERSONAL.DETAILS,
  })

  /** 개인 챌린지 인증 생성 (제출) */
  const { mutate: VerifyMutate, isPending } = useMutationStore<VerifyGroupChallengeResponse, VerifyVariables>(
    MUTATION_KEYS.CHALLENGE.PERSONAL.VERIFY,
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
    if (status === 'PENDING_APPROVAL') return '인증여부 판단 중'
    if (status === 'SUCCESS' || status === 'FAILURE' || status === 'DONE') return '참여 완료'
    return '참여하기'
  }

  /** 이미지 촬영 모달 열기 */
  const openImageModal = () => {
    // #0. 로그인 상태가 아닐 때
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
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
      openToast(ToastType.Error, '챌린지에 재참여할 수 없습니다.')
      return
    }

    const now = new Date()

    /** #예외2: 요일이 일치하지 않으면 참여 불가 */
    const nowDay: DayType = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() // e.g. 'MONDAY'
    if (nowDay !== dayOfWeek) {
      openToast(ToastType.Error, '챌린지 기간이 아닙니다')
      return
    }

    /** #예외3: 참여 가능한 시간이 아닐 경우 */
    const [startH, startM] = verificationStartTime.split(':').map(Number)
    const [endH, endM] = verificationEndTime.split(':').map(Number)
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    if (nowMinutes < startMinutes || nowMinutes > endMinutes) {
      openToast(ToastType.Error, '참여 가능한 시간이 아닙니다')
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
          openToast(ToastType.Success, `제출 성공!\nAI 판독 결과를 기다려주세요`) // 성공 메시지
        },
      },
    )
  }

  return (
    <S.Wrapper className={className}>
      <S.DescriptionSection>
        <S.Thumbnail src={thumbnailUrl} alt='썸네일' width={500} height={200} />

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
        {!isPending ? getSubmitButtonLabel(status) : <Loading />}
      </S.SubmitButton>
    </S.Wrapper>
  )
}

// export const dummyPersonalChallengeDetail: PersonalChallengeDetail = {
//   id: 1,
//   title: '제로 웨이스트 실천하기',
//   description:
//     '하루 동안 일회용품 사용을 줄이고, 텀블러와 장바구니를 활용해보세요.\n실천하는 모습의 인증샷을 업로드해주세요!',
//   thumbnailUrl: '/icon/category_zero_waste.png',
//   dayOfWeek: 'MONDAY',
//   verificationStartTime: '08:00' as TimeFormatString,
//   verificationEndTime: '22:00' as TimeFormatString,
//   leafReward: 15,
//   exampleImages: [
//     {
//       id: 1,
//       imageUrl: '/icon/category_zero_waste.png',
//       type: 'SUCCESS',
//       description: '텀블러 사용 장면',
//       sequenceNumber: 1,
//     },
//     {
//       id: 2,
//       imageUrl: '/icon/category_zero_waste.png',
//       type: 'SUCCESS',
//       description: '장바구니 사용 장면',
//       sequenceNumber: 2,
//     },
//     {
//       id: 3,
//       imageUrl: '/icon/category_zero_waste.png',
//       type: 'FAILURE',
//       description: '일회용 컵을 사용한 장면',
//       sequenceNumber: 3,
//     },
//   ],
//   status: 'NOT_SUBMITTED',
// }
