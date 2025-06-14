'use client'

import { useState } from 'react'

import ErrorText from '@shared/components/errortext'
import Loading from '@shared/components/loading'
import LucideIcon from '@shared/lib/ui/LucideIcon'

import { CHALLENGE_DETAILS_WARNINGS } from '../model/consts'
import { DetailsStepProps } from '../model/types'
import * as S from './styles'

const DetailStep = ({ form, handleStepChange, onSubmit, isCreating, isEdit }: DetailsStepProps) => {
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
            <S.InfoIcon>ⓘ</S.InfoIcon>
          </S.LabelRow>
          <S.SubText>썸네일 사진을 통해 챌린지를 홍보해보세요.</S.SubText>
          <S.StyledImageInput
            label='이미지를 업로드해주세요'
            icon={<LucideIcon name='Image' size={24} />}
            imageUrl={formValue.thumbnailUrl || null}
            onChange={({ imageUrl }) => {
              setValue('thumbnailUrl', imageUrl ?? '')
              trigger('thumbnailUrl')
            }}
            backgroundColor='lfWhite'
            cameraTitle='챌린지 썸네일'
            aspectRatio='FIVE_THREE'
          />
          <ErrorText message={isSubmitted ? errors.thumbnailUrl?.message : ''} />
        </S.FieldWrapper>

        <S.FieldWrapper>
          <S.Label>유의사항</S.Label>
          <S.WarningList>
            {CHALLENGE_DETAILS_WARNINGS.map(warnings => (
              <S.Warning key={warnings.value} isWarning={warnings.isWarning}>
                <LucideIcon name='Check' />
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
          {!isCreating ? BUTTON_TEXT : <Loading />}
        </S.SubmitButton>
      </S.ButtonWrapper>
    </S.Container>
  )
}

export default DetailStep
