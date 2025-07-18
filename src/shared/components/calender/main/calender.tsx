'use client'

import { useRef, useState } from 'react'

import { addMonths, startOfMonth, startOfToday, subMonths } from 'date-fns'

import { useOutsideClick } from '@/shared/hooks'
import { DayType } from '@/shared/lib'

import { CalendarDates } from '../dates'
import { CalendarHeader } from '../header'
import { CalendarWeekdays } from '../weekdays'

import * as S from './styles'

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
    <S.Wrapper className={className} ref={dropdownRef}>
      <CalendarHeader currentMonth={currentMonth} onPrev={handlePrevMonth} onNext={handleNextMonth} />
      <CalendarWeekdays startDayOfWeek={startDayOfWeek} />
      <CalendarDates currentMonth={currentMonth} startDate={startDate} endDate={endDate} onDateSelect={onDateSelect} />
    </S.Wrapper>
  )
}
