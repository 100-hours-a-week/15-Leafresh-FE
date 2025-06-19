'use client'

import { addMonths, startOfMonth, startOfToday, subMonths } from 'date-fns'

import { useRef, useState } from 'react'
import styled from '@emotion/styled'

import { DayType } from '@entities/challenge/type'
import { theme } from '@shared/config/style/theme'
import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'

import { CalendarDates } from '../../dates'
import { CalendarHeader } from '../../header'
import { CalendarWeekdays } from '../../weekdays'

interface CalendarProps {
  startDate?: Date
  endDate?: Date
  onDateSelect: (date: Date) => void
  startDayOfWeek?: DayType
  toggle: () => void
  className?: string
}

export const Calendar = ({
  startDate,
  endDate,
  onDateSelect,
  startDayOfWeek = 'SUNDAY',
  toggle,
  className,
}: CalendarProps) => {
  const today = startOfToday()
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(startDate ?? today))
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))

  useOutsideClick(dropdownRef as React.RefObject<HTMLElement>, toggle)

  return (
    <Wrapper className={className} ref={dropdownRef}>
      <CalendarHeader currentMonth={currentMonth} onPrev={handlePrevMonth} onNext={handleNextMonth} />
      <CalendarWeekdays startDayOfWeek={startDayOfWeek} />
      <CalendarDates currentMonth={currentMonth} startDate={startDate} endDate={endDate} onDateSelect={onDateSelect} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 280px;
  min-width: 260px;
  padding: 16px;
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfInput};
  background-color: ${theme.colors.lfWhite.base};
`
