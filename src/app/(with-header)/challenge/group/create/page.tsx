'use client'

import { z } from 'zod'

import { Controller, useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'

import { CHALLENGE_CATEGORIES_KOR, PARTICIPANT_RANGE } from '@entities/challenge/constant'
import ChallengeVerifyExamples from '@features/challenge/components/challenge-verify-examples/ChallengeVerifyExamples'
import DatePicker from '@shared/components/datepicker/DatePicker'
import Dropdown, { DropdownProps } from '@shared/components/dropdown'
import ErrorText from '@shared/components/errortext'
import Input from '@shared/components/input'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { StyledGeneric } from '@shared/styles/emotion/utils'
import { theme } from '@shared/styles/theme'

const schema = z.object({
  title: z.string().min(1, '챌린지 제목을 입력해주세요'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  startDate: z.date({ required_error: '시작일을 선택해주세요' }),
  endDate: z.date({ required_error: '종료일을 선택해주세요' }),
  maxParticipant: z.number({ required_error: '최대 인원을 선택해주세요' }).min(1, '최대 인원을 선택해주세요'),
})

type FormValues = z.infer<typeof schema>

const PARTICIPANT_OPTIONS = Array.from(
  { length: Math.floor((PARTICIPANT_RANGE.MAX - PARTICIPANT_RANGE.MIN) / PARTICIPANT_RANGE.RANGE) + 1 },
  (_, i) => PARTICIPANT_RANGE.MIN + i * PARTICIPANT_RANGE.RANGE,
)
const GroupChallengeCreatePage = () => {
  const {
    register,
    control,
    setValue,
    trigger,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: '',
      startDate: undefined,
      endDate: undefined,
    },
  })
  const value = {
    title: watch('title'),
    category: watch('category'),
    startDate: watch('startDate'),
    endDate: watch('endDate'),
    maxParticipant: watch('maxParticipant'),
  }

  const onSubmit = (data: FormValues) => {
    console.log(data)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <DividerWrapper>
        <Line />
        <Text>단체 챌린지 만들기</Text>
        <Line />
      </DividerWrapper>
      <FieldGroup>
        <FieldWrapper>
          <Input label='챌린지 제목' value={value.title} required {...register('title')} />
          <ErrorText message={errors.title?.message} />
        </FieldWrapper>

        <FieldWrapper>
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <CategoryDropdown
                label='카테고리'
                required
                options={CHALLENGE_CATEGORIES_KOR}
                selected={field.value}
                onChange={val => field.onChange(val)}
                getOptionKey={opt => opt}
                getOptionLabel={opt => opt}
              />
            )}
          />
          <ErrorText message={errors.category?.message} />
        </FieldWrapper>

        <FieldWrapper>
          <DatePicker
            label='챌린지 기간'
            icon={<LucideIcon name='Calendar' size={16} />}
            startDate={value.startDate}
            endDate={value.endDate}
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

          <ErrorText message={errors.startDate?.message} />
          <ErrorText message={errors.endDate?.message} />
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
          <ErrorText message={errors.maxParticipant?.message} />
        </FieldWrapper>

        <FieldWrapper>
          <ChallengeVerifyExamples
            title='인증샷 예시'
            description='* 해당 인증샷은 실제 검증모델에 사용되지 않는 참고용 사진입니다.'
            maxCount={3}
            required
          />
        </FieldWrapper>
      </FieldGroup>

      <SubmitButton type='submit'>다음 단계</SubmitButton>
    </Form>
  )
}

export default GroupChallengeCreatePage

const Form = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 24px;
`

const DividerWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 15px;
  margin-bottom: 24px;
`

const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${theme.colors.lfBlack.base};
`

const Text = styled.div`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  position: relative;
`

const FieldWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

// Dropdowns
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
  padding: 12px;
  border-radius: ${theme.radius.base};
  background-color: ${theme.colors.lfGreenInactive.base};
  color: ${theme.colors.lfBlack.base};
  font-weight: ${theme.fontWeight.semiBold};
  cursor: pointer;
  border: none;
`
