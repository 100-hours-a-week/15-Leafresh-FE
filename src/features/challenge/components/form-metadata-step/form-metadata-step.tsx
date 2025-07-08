'use client'

import { useCallback, useEffect, useState } from 'react'

import { sendGAEvent } from '@next/third-parties/google'

import { Controller, UseFormReturn } from 'react-hook-form'

import { CHALLENGE_CATEGORIES_KOR, FullFormValues, PARTICIPANT_RANGE } from '@/entities/challenge/model'

import { ErrorText, Input, LucideIcon } from '@/shared/components'

import { VerificationImageData } from '../challenge-verify-examples'

import * as S from './styles'

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

  const title = watch('title')
  const category = watch('category')
  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const startTime = watch('startTime')
  const endTime = watch('endTime')
  const maxParticipant = watch('maxParticipant')
  const examples = watch('examples')

  useEffect(() => {
    handleMetaCheck()
  }, [title, category, startDate, endDate, maxParticipant, examples])

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
    <S.Form onSubmit={handleMetaSubmit}>
      <S.DividerWrapper>
        <S.Text>{FORM_TITLE}</S.Text>
      </S.DividerWrapper>

      <S.FieldGroup>
        <S.FieldWrapper>
          <Input label='챌린지 제목' value={title} required {...register('title')} />
          <ErrorText message={isSubmitted ? errors.title?.message : ''} />
        </S.FieldWrapper>

        <S.FieldWrapper>
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <S.CategoryDropdown
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
        </S.FieldWrapper>

        <S.FieldWrapper>
          <S.StyledDatePicker
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
        </S.FieldWrapper>

        <S.FieldWrapper>
          <S.StyledTimePicker
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
        </S.FieldWrapper>

        <S.FieldWrapper>
          <Controller
            name='maxParticipant'
            control={control}
            render={({ field }) => (
              <S.ParticipantDropdown
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
        </S.FieldWrapper>

        <S.FieldWrapper>
          <S.StyledChallengeVerifyExamples
            title='인증샷 예시'
            description='* 해당 인증샷은 실제 검증모델에 사용되지 않는 참고용 사진입니다.'
            maxCount={5}
            examples={examples}
            onChange={handleExamplesChange}
            required
          />
          <ErrorText message={isSubmitted ? errors.examples?.message : ''} />
        </S.FieldWrapper>
      </S.FieldGroup>

      <S.SubmitButton type='submit'>다음 단계</S.SubmitButton>
    </S.Form>
  )
}
