'use client'

import { useState } from 'react'

import { UseFormReturn } from 'react-hook-form'

import { FullFormValues } from '@/entities/challenge/model'

import { ErrorText, LucideIcon } from '@/shared/components'

import * as S from './styles'
import { UploadThumbnailInput } from './thumbnail-image-input'

interface DetailsStepProps {
  form: UseFormReturn<FullFormValues>
  handleStepChange: (step: 1 | 2) => void
  onSubmit: () => void
  isCreating: boolean

  isEdit: boolean
}

type WarningType = {
  isWarning: boolean
  value: string
}

const CHALLENGE_DETAILS_WARNINGS: WarningType[] = [
  {
    isWarning: false,
    value: '참여 인원이 존재하면, 수정 및 삭제는 불가합니다.',
  },
  {
    isWarning: false,
    value: '참여 나뭇잎 보상은 직접 수정할 수 없습니다.',
  },
  {
    isWarning: false,
    value: '인증 여부는 생성자가 아닌, AI가 판단합니다.',
  },
  {
    isWarning: false,
    value: '생성된 챌린지는 모든 사용자에게 공개됩니다.',
  },
  {
    isWarning: true,
    value: '부적절한 챌린지는 관리자에 의해 삭제될 수 있습니다.',
  },
]

export const DetailStep = ({ form, handleStepChange, onSubmit, isCreating, isEdit }: DetailsStepProps) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = form
  const [isSubmitted, setIsSubmitted] = useState(false)

  const formValue = watch()

  const handleDetailSubmit = async () => {
    setIsSubmitted(true)
    const isFormValid = await trigger()

    if (isFormValid) {
      onSubmit()
    }
  }

  // 상수
  const FORM_TITLE: string = isEdit ? '단체 챌린지 수정하기' : '단체 챌린지 만들기'
  const BUTTON_TEXT = isEdit ? '수정하기' : '생성하기'
  return (
    <S.Container onSubmit={handleSubmit(handleDetailSubmit)}>
      <S.DividerWrapper>
        <S.Text>{FORM_TITLE}</S.Text>
      </S.DividerWrapper>
      <S.FieldGroup>
        <S.FieldWrapper>
          <S.Label>
            챌린지 설명 <S.RequiredMark>*</S.RequiredMark>
          </S.Label>
          <S.SubText>매력적인 글귀로 챌린지를 소개해보세요.</S.SubText>
          <S.TextArea {...register('description')} placeholder='예) Placeholder' />
          <ErrorText message={isSubmitted ? errors.description?.message : ''} />
        </S.FieldWrapper>

        <S.FieldWrapper>
          <S.LabelRow>
            <S.Label>
              챌린지 썸네일 이미지 <S.RequiredMark>*</S.RequiredMark>
            </S.Label>
          </S.LabelRow>
          <S.SubText>썸네일 사진을 통해 챌린지를 홍보해보세요.</S.SubText>
          <UploadThumbnailInput
            imageUrl={formValue.thumbnailUrl || null}
            onChange={({ imageUrl }) => {
              setValue('thumbnailUrl', imageUrl ?? '')
              trigger('thumbnailUrl')
            }}
          />

          <ErrorText message={isSubmitted ? errors.thumbnailUrl?.message : ''} />
        </S.FieldWrapper>

        <S.FieldWrapper>
          <S.Label>유의사항</S.Label>
          <S.WarningList>
            {CHALLENGE_DETAILS_WARNINGS.map(warnings => (
              <S.Warning key={warnings.value} isWarning={warnings.isWarning}>
                <LucideIcon name='Check' size={20} />
                <li>{warnings.value}</li>
              </S.Warning>
            ))}
          </S.WarningList>
        </S.FieldWrapper>
      </S.FieldGroup>

      <S.ButtonWrapper>
        <S.BackButton onClick={() => handleStepChange(1)} type='button' disabled={isCreating}>
          이전
        </S.BackButton>
        <S.SubmitButton type='submit' disabled={!isValid} $active={isValid}>
          {!isCreating ? BUTTON_TEXT : <S.StyledLoading hasText={false} />}
        </S.SubmitButton>
      </S.ButtonWrapper>
    </S.Container>
  )
}
