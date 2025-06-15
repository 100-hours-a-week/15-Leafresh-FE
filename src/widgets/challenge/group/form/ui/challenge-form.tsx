'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  CreateChallengeBody,
  CreateChallengeResponse,
  CreateChallengeVariables,
  ExampleImage,
} from '@entities/challenge/api/group/create-group'
import {
  KeepImage,
  ModifyChallengeBody,
  ModifyChallengeVariables,
  NewImage,
} from '@entities/challenge/api/group/modify-group'
import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/common/consts'
import { ChallengeCategoryType } from '@entities/common/type'
import DetailStep from '@features/challenge/components/challenge/group/create/DetailStep'
import MetaDataStep from '@features/challenge/components/challenge/group/create/MetadataStep'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/use-toast/useToast'
import { formatDateToDateFormatString } from '@shared/lib/date/utils'
import { TimeFormatString } from '@shared/types/date'

import { fullSchema } from '../model/constants'
import { ChallengeGroupFormPageProps, FullFormValues } from '../model/types'
import * as S from './styles'

import { zodResolver } from '@hookform/resolvers/zod'
import { sendGAEvent } from '@next/third-parties/google'

export const ChallengeGroupFormPage = ({ defaultValues, isEdit = false, challengeId }: ChallengeGroupFormPageProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const openToast = useToast()

  const [step, setStep] = useState<1 | 2>(1)

  const categoryFromQuery = searchParams.get('category') ?? ''
  const categoryKor: string = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(categoryFromQuery) ?? ''

  const mergedDefaultValues = useMemo(() => {
    const createdDefaultValues: FullFormValues = {
      ...defaultValues,
      category: categoryKor,
    }
    const modifyDefaultValues: FullFormValues = { ...defaultValues }

    return !isEdit ? createdDefaultValues : modifyDefaultValues
  }, [categoryFromQuery, defaultValues])

  const form = useForm<FullFormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: mergedDefaultValues,
    mode: 'onChange',
  })

  /** 단체 챌린지 생성 */
  const { mutate: CreateChallengeMutate, isPending: isCreating } = useMutationStore<
    CreateChallengeResponse,
    CreateChallengeVariables
  >(MUTATION_KEYS.CHALLENGE.GROUP.CREATE)

  /** 단체 챌린지 수정 */
  const { mutate: ModifyChallengeMutate, isPending: isModifying } = useMutationStore<
    null, // 204 응답
    ModifyChallengeVariables
  >(MUTATION_KEYS.CHALLENGE.GROUP.MODIFY)

  const isPending: boolean = isCreating || isModifying
  /** 단체 챌린지 생성 */
  const handleCreateSubmit = () => {
    sendGAEvent('event', 'group-create-step-3', { value: 'Step3: 챌린지 생성하기 버튼' }) // GA: 로그 수집

    const data = form.getValues()

    const {
      title,
      description,
      category,
      maxParticipant,
      thumbnailUrl,
      startDate,
      endDate,
      examples,
      startTime,
      endTime,
    } = data

    const filteredExamples = examples.filter(example => example.url !== null)
    const exampleImages: ExampleImage[] = filteredExamples.map((example, index) => ({
      imageUrl: example.url as string,
      type: example.type,
      description: example.description,
      sequenceNumber: index + 1, // 1부터 시작
    }))

    const body: CreateChallengeBody = {
      title,
      description,
      category: convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'kor', 'eng')(category) as ChallengeCategoryType,
      maxParticipantCount: maxParticipant,
      thumbnailImageUrl: thumbnailUrl,
      startDate: formatDateToDateFormatString(startDate),
      endDate: formatDateToDateFormatString(endDate),
      verificationStartTime: startTime as TimeFormatString,
      verificationEndTime: endTime as TimeFormatString,
      exampleImages: exampleImages,
    }
    CreateChallengeMutate(
      { body },
      {
        onSuccess: response => {
          const challengeId: number = response.data.id
          router.push(URL.CHALLENGE.GROUP.DETAILS.value(challengeId))
        },
      },
    )
  }

  /** 단체 챌린지 수정 */
  const handleModifySubmit = () => {
    if (!challengeId) return

    const {
      title,
      description,
      category,
      maxParticipant,
      thumbnailUrl,
      startDate,
      endDate,
      startTime,
      endTime,
      examples,
    } = form.getValues()

    const originalExamples = defaultValues.examples ?? [] // 초기 데이터
    const uploadedExamples = examples.filter(e => e.url !== null) // 입력용 삭제

    const keep: KeepImage[] = [] // 유지된 이미지
    const newImages: NewImage[] = [] // 생성된 이미지
    const deleted: number[] = [] // 삭제된 이미지

    uploadedExamples.forEach((example, index) => {
      // 기존에 있던 이미지
      if (example.id) {
        keep.push({
          id: example.id,
          sequenceNumber: index + 1,
        })
      }
      // 추가된 이미지
      else {
        newImages.push({
          imageUrl: example.url!,
          type: example.type,
          description: example.description,
          sequenceNumber: index + 1,
        })
      }
    })

    // 삭제된 이미지 id 추출
    originalExamples.forEach(origin => {
      const stillExists = uploadedExamples.some(e => e.id === origin.id)
      if (!stillExists && origin.id != null) {
        deleted.push(origin.id)
      }
    })

    const body: ModifyChallengeBody = {
      title,
      description,
      category: convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'kor', 'eng')(category) as ChallengeCategoryType,
      maxParticipantCount: maxParticipant,
      thumbnailImageUrl: thumbnailUrl,
      startDate: formatDateToDateFormatString(startDate),
      endDate: formatDateToDateFormatString(endDate),
      verificationStartTime: startTime as TimeFormatString,
      verificationEndTime: endTime as TimeFormatString,
      exampleImages: {
        keep,
        new: newImages,
        deleted,
      },
    }

    ModifyChallengeMutate(
      { challengeId, body },
      {
        onSuccess: () => {
          // 단체 챌린지 상세 페이지로 이동
          openToast(ToastType.Success, '챌린지 수정 성공')
          router.push(URL.CHALLENGE.GROUP.DETAILS.value(challengeId))
        },
      },
    )
  }

  /** 스텝 변경 */
  const handleStepChange = (step: 1 | 2) => {
    setStep(step)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  return (
    <S.PageWrapper>
      {step === 1 ? (
        <MetaDataStep form={form} handleStepChange={handleStepChange} isEdit={isEdit} />
      ) : (
        <DetailStep
          form={form}
          handleStepChange={handleStepChange}
          onSubmit={!isEdit ? handleCreateSubmit : handleModifySubmit}
          isCreating={isCreating}
          isEdit={isEdit}
        />
      )}
    </S.PageWrapper>
  )
}
