import styled from '@emotion/styled'

import { ImageInput, Loading } from '@/shared/components'

export const Container = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const DividerWrapper = styled.div`
  width: 100%;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ButtonWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`

export const Text = styled.div`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-decoration: underline;
  text-underline-offset: 4px;
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`
export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`
export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`
export const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.lfGreenBorder.base};
`
export const SubText = styled.p`
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
  font-size: ${({ theme }) => theme.fontSize.xs};
  margin-bottom: 4px;
`
export const InfoIcon = styled.span`
  font-size: 14px;
`
export const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.lfGray.base};
  border-radius: ${({ theme }) => theme.radius.base};
  padding: 12px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  resize: none;
  min-height: 120px;
`

export const WarningList = styled.ul`
  font-size: ${({ theme }) => theme.fontSize.sm};
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 5px;
`

export const Warning = styled.div<{ isWarning: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;

  color: ${({ isWarning, theme }) => (isWarning ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};
`

export const BackButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 50px;
  border-radius: ${({ theme }) => theme.radius.base};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  border: 1px solid ${({ theme }) => theme.colors.lfGray.base};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

export const SubmitButton = styled.button<{ $active: boolean; disabled?: boolean }>`
  width: 100%;
  height: 50px;
  border-radius: ${({ theme }) => theme.radius.base};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.lfGreenMain.base : theme.colors.lfGreenInactive.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  border: none;

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

export const StyledImageInput = styled(ImageInput)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.lfGray.base};
`

export const StyledLoading = styled(Loading)`
  margin: 0;
`
