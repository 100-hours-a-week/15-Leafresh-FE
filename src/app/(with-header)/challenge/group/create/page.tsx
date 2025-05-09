'use client'

import { z } from 'zod'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'

import DetailStep, {
  defaultDetailFormValues,
  detailSchema,
} from '@features/challenge/components/challenge/group/create/DetailStep'
import MetaDataStep, {
  defaultMetaFormValues,
  metaSchema,
} from '@features/challenge/components/challenge/group/create/MetadataStep'
import { theme } from '@shared/styles/theme'

const fullSchema = metaSchema.merge(detailSchema)
export type FullFormValues = z.infer<typeof fullSchema>

const GroupChallengeCreatePage = () => {
  const [step, setStep] = useState<1 | 2>(1)

  const form = useForm<FullFormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      ...defaultMetaFormValues,
      ...defaultDetailFormValues,
    },
  })

  const handleFinalSubmit = () => {
    const data = form.getValues()
    // TODO: API 호출 처리
    console.log('data :', data)
  }

  return (
    <PageWrapper>
      {step === 1 ? (
        <MetaDataStep
          form={form}
          onNext={() => {
            console.log('exected on next')

            setStep(2)
          }}
        />
      ) : (
        <DetailStep form={form} onBack={() => setStep(1)} onSubmit={handleFinalSubmit} />
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
