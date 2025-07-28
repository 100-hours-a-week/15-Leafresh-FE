'use client'

import React, { useState } from 'react'

import * as S from './styles'
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
    <S.Wrapper className={className}>
      <S.LabelWrapper>
        {icon}
        <S.Label>
          {label}
          {required && <S.RequiredMark>*</S.RequiredMark>}
        </S.Label>
      </S.LabelWrapper>

      <S.StyledComponentSelect
        readOnly={readOnly}
        trigger={<DatePickerTrigger startDate={startDate} endDate={endDate} />}
        component={<S.StyledStartCalendar startDate={startDate} endDate={endDate} onDateSelect={handleDateSelect} />}
      />
    </S.Wrapper>
  )
}
