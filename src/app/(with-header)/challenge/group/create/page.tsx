'use client'

import { useRouter } from 'next/navigation'
import { z } from 'zod'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/constant'
import { ChallengeCategoryType } from '@entities/challenge/type'
import { CreateChallenge, ExampleImageType } from '@features/challenge/api/create-group-challenge'
import DetailStep, {
  defaultDetailFormValues,
  detailSchema,
} from '@features/challenge/components/challenge/group/create/DetailStep'
import MetaDataStep, {
  defaultMetaFormValues,
  metaSchema,
} from '@features/challenge/components/challenge/group/create/MetadataStep'
import { URL } from '@shared/constants/route/route'
import { formatDateToDateFormatString } from '@shared/lib/date/utils'
import { theme } from '@shared/styles/theme'
import { TimeFormatString } from '@shared/types/date'

const fullSchema = metaSchema.merge(detailSchema)
export type FullFormValues = z.infer<typeof fullSchema>

const GroupChallengeCreatePage = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const router = useRouter()

  const form = useForm<FullFormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      ...defaultMetaFormValues,
      ...defaultDetailFormValues,
    },
  })

  /** 단체 챌린지 생성 */
  const { mutate: CreateGroupChallengeMutate, isPending: isCreating } = useMutation({
    mutationFn: CreateChallenge,
    onSuccess: response => {
      const challengeId: number = response.data.id
      router.push(URL.CHALLENGE.GROUP.DETAILS.value(challengeId))
    },
    onError: () => {
      // TODO : 토스트 에러 처리
      // openToast(ToastType.Error, '회원가입 중 오류가 발생했습니다.')
    },
  })

  const handleFinalSubmit = () => {
    const data = form.getValues()

    // TODO : 시작시간 - 종료시간 데이터 넣기
    const { title, description, category, maxParticipant, thumbnailUrl, startDate, endDate, examples } = data

    /**
     * {
      type: "SUCCESS" | "FAILURE";
      url: string | null;
      description: string;
      }
     */

    const filteredExamples = examples.filter(example => example.url !== null)
    const exampleImages = filteredExamples.map((example, index) => ({
      imageUrl: example.url,
      type: example.type,
      description: example.description,
      sequenceNumber: index + 1,
    }))

    CreateGroupChallengeMutate({
      title,
      description,
      category: convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'kor', 'eng')(category) as ChallengeCategoryType,
      maxParticipantCount: maxParticipant,
      thumbnailImageUrl: thumbnailUrl,
      startDate: formatDateToDateFormatString(startDate),
      endDate: formatDateToDateFormatString(endDate),
      verificationStartTime: '10:10' as TimeFormatString,
      verificationEndTime: '22:30' as TimeFormatString,
      exampleImages: exampleImages as ExampleImageType[],
    })
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
