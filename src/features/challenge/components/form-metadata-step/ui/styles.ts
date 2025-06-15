import { memo } from 'react'

import DatePicker from '@shared/components/datepicker/ui/date-picker'
import Dropdown, { DropdownProps } from '@shared/components/dropdown/ui/dropdown'
import TimePicker from '@shared/components/timepicker/picker/ui/time-picker'
import { StyledGeneric } from '@shared/styles/emotion/utils'

import { ChallengeVerifyExamples } from '../../challenge-verify-examples'

import styled from '@emotion/styled'

export const Form = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const DividerWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
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
  gap: 60px;

  position: relative;
`

export const FieldWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const CategoryDropdown = StyledGeneric<DropdownProps<string>>(
  Dropdown,
  `
  width: 100%;
`,
)
export const ParticipantDropdown = StyledGeneric<DropdownProps<number>>(
  Dropdown,
  `
  width: 100%;
  
`,
)

export const SubmitButton = styled.button`
  height: 50px;
  border-radius: ${({ theme }) => theme.radius.base};
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  cursor: pointer;
  border: none;
`

export const StyledDatePicker = memo(styled(DatePicker)`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`)

export const StyledChallengeVerifyExamples = memo(styled(ChallengeVerifyExamples)`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`)

export const StyledTimePicker = memo(styled(TimePicker)`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`)
