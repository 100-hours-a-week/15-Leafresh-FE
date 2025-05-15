'use client'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { useMemo,useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'

import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/constant'
import { ChallengeCategoryType } from '@entities/challenge/type'
import {
  CreateChallengeBody,
  CreateChallengeResponse,
  CreateChallengeVariables,
  ExampleImageType,
} from '@features/challenge/api/create-group-challenge'
import DetailStep, {
  defaultDetailFormValues,
  detailSchema,
} from '@features/challenge/components/challenge/group/create/DetailStep'
import MetaDataStep, {
  defaultMetaFormValues,
  metaSchema,
} from '@features/challenge/components/challenge/group/create/MetadataStep'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route/route'
import { formatDateToDateFormatString } from '@shared/lib/date/utils'
import { theme } from '@shared/styles/theme'
import { TimeFormatString } from '@shared/types/date'

const fullSchema = metaSchema
  .merge(detailSchema)
  .refine(
    ({ startDate, endDate }) => {
      const start = startDate.setHours(0, 0, 0, 0)
      const end = endDate.setHours(0, 0, 0, 0)
      const msDiff = end - start
      return msDiff > 0
    },
    {
      path: ['endDate'],
      message: '하루 지속되는 챌린지는 불가능합니다.',
    },
  )
  .refine(
    data => {
      const msPerDay = 24 * 60 * 60 * 1000
      const start = data.startDate.setHours(0, 0, 0, 0)
      const end = data.endDate.setHours(0, 0, 0, 0)
      const diffDays = (end - start) / msPerDay
      return diffDays >= 1
    },
    {
      path: ['endDate'],
      message: '종료일은 시작일보다 정확히 하루 뒤여야 합니다.',
    },
  )

export type FullFormValues = z.infer<typeof fullSchema>

const GroupChallengeCreatePage = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const router = useRouter()

  const searchParams = useSearchParams()
  const categoryFromQuery = searchParams.get('category') ?? ''

  const convertCategory = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')
  const categoryKor = convertCategory(categoryFromQuery) ?? '' // '제로웨이스트'

  const defaultValues = useMemo(() => {
    return {
      ...defaultMetaFormValues,
      ...defaultDetailFormValues,
      category: categoryKor,
    }
  }, [categoryFromQuery])

  const form = useForm<FullFormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues,
    mode: 'onChange',
  })

  /** 단체 챌린지 생성 */
  const { mutate: CreateChallengeMutate, isPending: isCreating } = useMutationStore<
    CreateChallengeResponse,
    CreateChallengeVariables
  >(MUTATION_KEYS.CHALLENGE.GROUP.CREATE)

  const handleFinalSubmit = () => {
    const data = form.getValues()

    // TODO : 시작시간 - 종료시간 데이터 넣기
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
    const exampleImages = filteredExamples.map((example, index) => ({
      imageUrl: example.url,
      type: example.type,
      description: example.description,
      sequenceNumber: index + 1,
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
      exampleImages: exampleImages as ExampleImageType[],
    }
    CreateChallengeMutate(
      { body },
      {
        onSuccess: response => {
          const challengeId: number = response.data.data.id
          router.push(URL.CHALLENGE.GROUP.DETAILS.value(challengeId))
        },
        onError: () => {
          // TODO : 토스트 에러 처리
          // openToast(ToastType.Error, '회원가입 중 오류가 발생했습니다.')
        },
      },
    )
  }

  return (
    <PageWrapper>
      {step === 1 ? (
        <MetaDataStep
          form={form}
          onNext={() => {
            setStep(2)
          }}
        />
      ) : (
        <DetailStep form={form} onBack={() => setStep(1)} onSubmit={handleFinalSubmit} isCreating={isCreating} />
      )}
    </PageWrapper>
  )
}

export default GroupChallengeCreatePage

const PageWrapper = styled.div`
  width: 100%;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 480px;
  margin: 0 auto;
  background-color: ${theme.colors.lfWhite.base};
`
