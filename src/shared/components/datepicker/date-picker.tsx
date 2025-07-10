'use client'

import React, { useState } from 'react'

import { format } from 'date-fns'

import { Calendar } from '@/shared/components'
import { dayToString } from '@/shared/lib'

import * as S from './styles'

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
  const [status, setStatus] = useState<'start' | 'end' | null>(null)

  const toggleStart = () => {
    if (!readOnly) setStatus(prev => (prev === 'start' ? null : 'start'))
  }

  const toggleEnd = () => {
    if (!readOnly) setStatus(prev => (prev === 'end' ? null : 'end'))
  }

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
  const isStartActive = status === 'start' || !!startDate
  const isEndActive = status === 'end' || !!endDate

  return (
    <S.Wrapper className={className}>
      <S.LabelWrapper>
        {icon}
        <S.Label>
          {label}
          {required && <S.RequiredMark>*</S.RequiredMark>}
        </S.Label>
      </S.LabelWrapper>

      <S.InputGroup>
        <S.InputArea isFocused={isStartActive} onClick={toggleStart} readOnly={readOnly}>
          <S.DateText isValid={!!startDate}>
            {startDate ? `${format(startDate, 'MM.dd')} (${dayToString(startDate.getDay())})` : '시작날짜'}
          </S.DateText>
        </S.InputArea>

        <S.Tilde>~</S.Tilde>

        <S.InputArea isFocused={isEndActive} onClick={toggleEnd} readOnly={readOnly}>
          <S.DateText isValid={!!endDate}>
            {endDate ? `${format(endDate, 'MM.dd')} (${dayToString(endDate.getDay())})` : '종료날짜'}
          </S.DateText>
        </S.InputArea>

        {!readOnly && status && (
          <S.CalendarWrapper>
            <Calendar
              startDate={startDate}
              endDate={endDate}
              onDateSelect={handleDateSelect}
              toggle={() => setStatus(null)}
            />
          </S.CalendarWrapper>
        )}
      </S.InputGroup>
    </S.Wrapper>
  )
}
