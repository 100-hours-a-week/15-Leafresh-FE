'use client'

import { memo, useCallback, useEffect, useState } from 'react'

import { sendGAEvent } from '@next/third-parties/google'

import { Controller, UseFormReturn } from 'react-hook-form'

import styled from '@emotion/styled'

import { CHALLENGE_CATEGORIES_KOR, FullFormValues, PARTICIPANT_RANGE } from '@/entities/challenge/model'

import { DatePicker, ErrorText, Input, LucideIcon, SelectInput, SelectItem, SingleSelect } from '@/shared/components'
import { TimePicker } from '@/shared/components/timepicker'
import { theme } from '@/shared/config'

import { ChallengeVerifyExamples, VerificationImageData } from '../challenge-verify-examples'

const PARTICIPANT_OPTIONS = Array.from(
  { length: Math.floor((PARTICIPANT_RANGE.MAX - PARTICIPANT_RANGE.MIN) / PARTICIPANT_RANGE.RANGE) + 1 },
  (_, i) => PARTICIPANT_RANGE.MIN + i * PARTICIPANT_RANGE.RANGE,
)

interface MetaDataStepProps {
  form: UseFormReturn<FullFormValues>
  handleStepChange: (step: 1 | 2) => void
  isEdit: boolean
}

export const MetaDataStep = ({ form, handleStepChange, isEdit }: MetaDataStepProps) => {
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
              <SingleSelect<string>
                trigger={<SelectInput label={'카테고리'} selected={field.value} required />}
                selected={field.value}
                onSelect={val => field.onChange(val)}
                options={CHALLENGE_CATEGORIES_KOR.slice(0, -1)}
                renderOption={option => <SelectItem option={option} />}
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
              <SingleSelect<number>
                trigger={<SelectInput label={'최대 인원'} selected={field.value} required />}
                selected={field.value}
                onSelect={val => field.onChange(val)}
                options={PARTICIPANT_OPTIONS}
                renderOption={option => <SelectItem option={option} />}
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

// const CategoryDropdown = StyledGeneric<DropdownProps<string>>(
//   Dropdown,
//   `
//   width: 100%;
// `,
// )
// const ParticipantDropdown = StyledGeneric<DropdownProps<number>>(
//   Dropdown,
//   `
//   width: 100%;

// `,
// )

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
