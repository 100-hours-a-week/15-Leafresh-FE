'use client'

import { format } from 'date-fns'

import React, { useState } from 'react'
import styled from '@emotion/styled'

import { Calendar } from '@shared/components/calender'
import { dayToString } from '@shared/lib/date/utils'
import { theme } from '@shared/styles/theme'

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
    <Wrapper className={className}>
      <LabelWrapper>
        {icon}
        <Label>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      </LabelWrapper>

      <InputGroup>
        <InputArea isFocused={isStartActive} onClick={toggleStart} readOnly={readOnly}>
          <DateText isValid={!!startDate}>
            {startDate ? `${format(startDate, 'MM.dd')} (${dayToString(startDate.getDay())})` : '시작날짜'}
          </DateText>
        </InputArea>

        <Tilde>~</Tilde>

        <InputArea isFocused={isEndActive} onClick={toggleEnd} readOnly={readOnly}>
          <DateText isValid={!!endDate}>
            {endDate ? `${format(endDate, 'MM.dd')} (${dayToString(endDate.getDay())})` : '종료날짜'}
          </DateText>
        </InputArea>

        {!readOnly && status && (
          <CalendarWrapper>
            <Calendar
              startDate={startDate}
              endDate={endDate}
              onDateSelect={handleDateSelect}
              toggle={() => setStatus(null)}
            />
          </CalendarWrapper>
        )}
      </InputGroup>
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

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`

const InputArea = styled.div<{ isFocused: boolean; readOnly?: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 10px 0;
  border-bottom: 2px solid ${theme.colors.lfLightGray.base};
  font-weight: ${theme.fontWeight.semiBold};
  cursor: ${({ readOnly }) => (readOnly ? 'default' : 'pointer')};

  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%) scaleX(${({ isFocused, readOnly }) => (readOnly ? 0 : isFocused ? 1 : 0)});
    transform-origin: center;
    width: 100%;
    height: 2px;
    background-color: ${theme.colors.lfBlack.base};
    transition: transform 0.3s ease;
  }
`

const Tilde = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
`

const DateText = styled.div<{ isValid: boolean }>`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${({ isValid }) => (isValid ? theme.colors.lfBlack.base : theme.colors.lfDarkGray.base)};
`

const CalendarWrapper = styled.div`
  position: absolute;
  z-index: 10;
  top: calc(100% + 12px);
`
