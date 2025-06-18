'use client'

import { z } from 'zod'

import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import styled from '@emotion/styled'

import ErrorText from '@shared/components/errortext/ui/error-text'
import ImageInput from '@shared/components/image-input/ui/image-input'
import Loading from '@shared/components/loading/ui/loading'
import LucideIcon from '@shared/components/lucide-icon/ui/lucide-icon'
import { theme } from '@shared/styles/theme'

import { FullFormValues } from '../../../../../../widgets/challenge/group/form/ui/challenge-form'

export const detailSchema = z.object({
  description: z.string().min(1, '챌린지 설명을 입력해주세요'),
  thumbnailUrl: z.string().min(1, '썸네일 이미지를 등록해주세요'),
})

export type DetailFormValues = z.infer<typeof detailSchema>

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
    <Container onSubmit={handleSubmit(handleDetailSubmit)}>
      <DividerWrapper>
        <Text>{FORM_TITLE}</Text>
      </DividerWrapper>
      <FieldGroup>
        <FieldWrapper>
          <Label>
            챌린지 설명 <RequiredMark>*</RequiredMark>
          </Label>
          <SubText>매력적인 글귀로 챌린지를 소개해보세요.</SubText>
          <TextArea {...register('description')} placeholder='예) Placeholder' />
          <ErrorText message={isSubmitted ? errors.description?.message : ''} />
        </FieldWrapper>

        <FieldWrapper>
          <LabelRow>
            <Label>
              챌린지 썸네일 이미지 <RequiredMark>*</RequiredMark>
            </Label>
            <InfoIcon>ⓘ</InfoIcon>
          </LabelRow>
          <SubText>썸네일 사진을 통해 챌린지를 홍보해보세요.</SubText>
          <StyledImageInput
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
        </FieldWrapper>

        <FieldWrapper>
          <Label>유의사항</Label>
          <WarningList>
            {CHALLENGE_DETAILS_WARNINGS.map(warnings => (
              <Warning key={warnings.value} isWarning={warnings.isWarning}>
                <LucideIcon name='Check' />
                <li>{warnings.value}</li>
              </Warning>
            ))}
          </WarningList>
        </FieldWrapper>
      </FieldGroup>

      <ButtonWrapper>
        <BackButton onClick={() => handleStepChange(1)} type='button' disabled={isCreating}>
          이전
        </BackButton>
        <SubmitButton type='submit' disabled={!isValid} $active={isValid}>
          {!isCreating ? BUTTON_TEXT : <StyledLoading hasText={false} />}
        </SubmitButton>
      </ButtonWrapper>
    </Container>
  )
}

export default DetailStep

// === Styles ===
const Container = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const DividerWrapper = styled.div`
  width: 100%;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ButtonWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
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
  gap: 32px;
`
const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`
const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`
const RequiredMark = styled.span`
  color: ${theme.colors.lfGreenBorder.base};
`
const SubText = styled.p`
  color: ${theme.colors.lfDarkGray.base};
  font-size: ${theme.fontSize.xs};
  margin: 5px 0 8px 0;
`
const InfoIcon = styled.span`
  font-size: 14px;
`
const TextArea = styled.textarea`
  border: 1px solid ${theme.colors.lfGray.base};
  border-radius: ${theme.radius.base};
  padding: 12px;
  font-size: ${theme.fontSize.xs};
  resize: none;
  min-height: 120px;
`

const WarningList = styled.ul`
  font-size: ${theme.fontSize.xs};
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 5px;
`

const Warning = styled.div<{ isWarning: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  color: ${({ isWarning }) => (isWarning ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};
`

const BackButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 50px;
  border-radius: ${theme.radius.base};
  color: ${theme.colors.lfBlack.base};
  background-color: ${theme.colors.lfWhite.base};
  font-weight: ${theme.fontWeight.regular};
  border: 1px solid ${theme.colors.lfGray.base};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

const SubmitButton = styled.button<{ $active: boolean; disabled?: boolean }>`
  width: 100%;
  height: 50px;
  border-radius: ${theme.radius.base};
  background-color: ${({ $active }) => ($active ? theme.colors.lfGreenMain.base : theme.colors.lfGreenInactive.base)};
  color: ${theme.colors.lfWhite.base};
  font-weight: ${theme.fontWeight.semiBold};
  border: none;

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const StyledImageInput = styled(ImageInput)`
  width: 100%;
  border: 1px solid ${theme.colors.lfGray.base};
`

const StyledLoading = styled(Loading)`
  margin: 0;
`
