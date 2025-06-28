'use client'

import { convertDayToLabel, DAYS, DayType } from '@/shared/lib'

import * as S from './styles'

interface CalendarWeekdaysProps {
  startDayOfWeek: DayType
}

export const CalendarWeekdays = ({ startDayOfWeek }: CalendarWeekdaysProps) => {
  const getOrderedDays = () => {
    const startIndex = DAYS.indexOf(startDayOfWeek)
    return [...DAYS.slice(startIndex), ...DAYS.slice(0, startIndex)]
  }

  return (
    <S.Weekdays>
      {getOrderedDays().map(day => (
        <S.Weekday key={day}>{convertDayToLabel(day)}</S.Weekday>
      ))}
    </S.Weekdays>
  )
}
