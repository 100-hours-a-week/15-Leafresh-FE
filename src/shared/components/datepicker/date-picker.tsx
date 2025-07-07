'use client'

import React, { useState } from 'react'

import styled from '@emotion/styled'

import { Calendar, ComponentSelect } from '@/shared/components'
import { theme } from '@/shared/config'

import { DatePickerTrigger } from './trigger'

interface DatePickerProps {
  icon: React.JSX.Element
  label: string
  startDate?: Date
  endDate?: Date
  setStartDate: (date: Date | undefined) => void
  setEndDate: (date: Date | undefined) => void
  required?: boolean
  readOnly?: boolean
  className?: string
}

export const DatePicker = ({
  icon,
  label,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  required,
  readOnly = false,
  className,
}: DatePickerProps) => {
  const [status, setStatus] = useState<'start' | 'end'>('start')
  const handleDateSelect = (date: Date) => {
    if (status === 'start') {
      if (endDate && date > endDate) {
        setStartDate(date)
        setEndDate(undefined)
      } else {
        setStartDate(date)
      }
      setStatus('end')
    } else if (status === 'end') {
      if (!startDate || date < startDate) {
        setStartDate(date)
        setStatus('end')
      } else {
        setEndDate(date)
      }
    }
  }

  return (
    <Wrapper className={className}>
      <LabelWrapper>
        {icon}
        <Label>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      </LabelWrapper>

      <StyledComponentSelect
        readOnly={readOnly}
        trigger={<DatePickerTrigger startDate={startDate} endDate={endDate} />}
        component={<StyledStartCalendar startDate={startDate} endDate={endDate} onDateSelect={handleDateSelect} />}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Label = styled.label`
  color: ${theme.colors.lfBlack.base};
`

const RequiredMark = styled.span`
  color: ${theme.colors.lfGreenBorder.base};
  margin-left: 4px;
`

const StyledComponentSelect = styled(ComponentSelect)<{ readOnly?: boolean }>`
  flex: 1;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-weight: ${theme.fontWeight.semiBold};
  cursor: ${({ readOnly }) => (readOnly ? 'default' : 'pointer')};
`

const StyledCalendar = styled(Calendar)`
  position: absolute;
  top: calc(100% + 20px);

  z-index: 10;
`

const StyledStartCalendar = styled(StyledCalendar)`
  left: 50%;
  transform: translateX(-50%);
`
