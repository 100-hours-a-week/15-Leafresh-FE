'use client'

import { memo, useCallback, useEffect, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { CHALLENGE_CATEGORIES_KOR, PARTICIPANT_RANGE } from '@entities/common/consts'
import ChallengeVerifyExamples, {
  VerificationImageData,
} from '@features/challenge/components/common/ChallengeVerifyExamples'
import DatePicker from '@shared/components/datepicker/DatePicker'
import Dropdown, { DropdownProps } from '@shared/components/dropdown'
import ErrorText from '@shared/components/errortext'
import Input from '@shared/components/input'
import TimePicker from '@shared/components/timepicker/TimePicker'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { StyledGeneric } from '@shared/styles/emotion/utils'
import { theme } from '@shared/styles/theme'

import styled from '@emotion/styled'
import { sendGAEvent } from '@next/third-parties/google'
import { FullFormValues } from '@widgets/challenge/group/form/model/types'

const PARTICIPANT_OPTIONS = Array.from(
  { length: Math.floor((PARTICIPANT_RANGE.MAX - PARTICIPANT_RANGE.MIN) / PARTICIPANT_RANGE.RANGE) + 1 },
  (_, i) => PARTICIPANT_RANGE.MIN + i * PARTICIPANT_RANGE.RANGE,
)
export const metaSchema = z.object({
  title: z.string().min(1, '챌린지 제목을 입력해주세요.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  startDate: z.date({ required_error: '시작일을 선택해주세요.' }),
  endDate: z.date({ required_error: '종료일을 선택해주세요.' }),
  startTime: z.string().min(1, '시작 시간을 선택해주세요.'),
  endTime: z.string().min(1, '종료 시간을 선택해주세요.'),
  maxParticipant: z.number({ required_error: '최대 인원을 선택해주세요.' }).min(1, '최대 인원을 선택해주세요.'),
  examples: z
    .array(
      z.object({
        id: z.number().optional(), // 상세 포함, 생성 미포함
        url: z.string().nullable(),
        description: z.string(),
        type: z.enum(['SUCCESS', 'FAILURE']),
      }),
    )
    .refine(
      examples => {
        const validSlots = examples.filter(e => e.url !== null)
        const hasSuccess = validSlots.some(e => e.type === 'SUCCESS')
        return hasSuccess
      },
      {
        message: '성공 예시 이미지를 최소 1개 등록해주세요.',
      },
    ),
})

export type MetaFormValues = z.infer<typeof metaSchema>

interface MetaDataStepProps {
  form: UseFormReturn<FullFormValues>
  handleStepChange: (step: 1 | 2) => void
  isEdit: boolean
}

const MetaDataStep = ({ form, handleStepChange, isEdit }: MetaDataStepProps) => {
  const {
    register,
    control,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = form
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMetaValid, setIsMetaValid] = useState(false)

  const handleMetaCheck = async () => {
    const valid = await trigger(['title', 'category', 'startDate', 'endDate', 'maxParticipant', 'examples'])
    setIsMetaValid(valid)
  }
  useEffect(() => {
    handleMetaCheck()
  }, [
    watch('title'),
    watch('category'),
    watch('startDate'),
    watch('endDate'),
    watch('maxParticipant'),
    watch('examples'),
  ])

  const title = watch('title')
  const category = watch('category')
  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const startTime = watch('startTime')
  const endTime = watch('endTime')
  const maxParticipant = watch('maxParticipant')
  const examples = watch('examples')

  const handleExamplesChange = useCallback(
    (updated: VerificationImageData[]) => {
      setValue('examples', updated)
      trigger('examples')
    },
    [setValue, trigger],
  )

  const handleMetaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isSubmitted) {
      setIsSubmitted(true)
    }
    if (isMetaValid) {
      sendGAEvent('event', 'group-create-step-2', { value: 'Step2: 챌린지 다음 버튼' }) // GA: 로그 수집

      handleStepChange(2)
    }
  }

  // 상수
  const FORM_TITLE: string = isEdit ? '단체 챌린지 수정하기' : '단체 챌린지 만들기'
  return (
    <Form onSubmit={handleMetaSubmit}>
      <DividerWrapper>
        <Text>{FORM_TITLE}</Text>
      </DividerWrapper>

      <FieldGroup>
        <FieldWrapper>
          <Input label='챌린지 제목' value={title} required {...register('title')} />
          <ErrorText message={isSubmitted ? errors.title?.message : ''} />
        </FieldWrapper>

        <FieldWrapper>
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <CategoryDropdown
                label='카테고리'
                required
                options={CHALLENGE_CATEGORIES_KOR.slice(0, -1)}
                selected={field.value}
                onChange={val => field.onChange(val)}
                getOptionKey={opt => opt}
                getOptionLabel={opt => opt}
              />
            )}
          />
          <ErrorText message={isSubmitted ? errors.category?.message : ''} />
        </FieldWrapper>

        <FieldWrapper>
          <StyledDatePicker
            label='챌린지 기간'
            icon={<LucideIcon name='Calendar' size={16} />}
            startDate={startDate}
            endDate={endDate}
            setStartDate={date => {
              if (date) {
                setValue('startDate', date)
                trigger('startDate')
              }
            }}
            setEndDate={date => {
              if (date) {
                setValue('endDate', date)
                trigger('endDate')
              }
            }}
            required
          />
          <ErrorText message={isSubmitted ? errors.startDate?.message : ''} />
          <ErrorText message={isSubmitted ? errors.endDate?.message : ''} />
        </FieldWrapper>

        <FieldWrapper>
          <StyledTimePicker
            label='인증 가능 시간 *'
            startValue={startTime}
            endValue={endTime}
            onChangeStart={value => {
              setValue('startTime', value)
              trigger('startTime')
            }}
            onChangeEnd={value => {
              setValue('endTime', value)
              trigger('endTime')
            }}
          />
          <ErrorText message={isSubmitted ? errors.startTime?.message : ''} />
          <ErrorText message={isSubmitted ? errors.endTime?.message : ''} />
        </FieldWrapper>

        <FieldWrapper>
          <Controller
            name='maxParticipant'
            control={control}
            render={({ field }) => (
              <ParticipantDropdown
                label='최대 인원'
                required
                selected={field.value}
                options={PARTICIPANT_OPTIONS}
                onChange={val => field.onChange(val)}
                getOptionKey={opt => opt}
                getOptionLabel={opt => `${opt}명`}
              />
            )}
          />
          <ErrorText message={isSubmitted ? errors.maxParticipant?.message : ''} />
        </FieldWrapper>

        <FieldWrapper>
          <StyledChallengeVerifyExamples
            title='인증샷 예시'
            description='* 해당 인증샷은 실제 검증모델에 사용되지 않는 참고용 사진입니다.'
            maxCount={5}
            examples={examples}
            onChange={handleExamplesChange}
            required
          />
          <ErrorText message={isSubmitted ? errors.examples?.message : ''} />
        </FieldWrapper>
      </FieldGroup>

      <SubmitButton type='submit'>다음 단계</SubmitButton>
    </Form>
  )
}

export default MetaDataStep

const Form = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 24px;
`

const DividerWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`

const Text = styled.div`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  text-decoration: underline;
  text-underline-offset: 4px;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;

  position: relative;
`

const FieldWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const CategoryDropdown = StyledGeneric<DropdownProps<string>>(
  Dropdown,
  `
  width: 100%;
`,
)
const ParticipantDropdown = StyledGeneric<DropdownProps<number>>(
  Dropdown,
  `
  width: 100%;
  
`,
)

const SubmitButton = styled.button`
  height: 50px;
  border-radius: ${theme.radius.base};
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  font-weight: ${theme.fontWeight.semiBold};
  cursor: pointer;
  border: none;
`

const StyledDatePicker = memo(styled(DatePicker)`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semiBold};
`)

const StyledChallengeVerifyExamples = memo(styled(ChallengeVerifyExamples)`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`)

const StyledTimePicker = memo(styled(TimePicker)`
  width: 100%;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`)
