'use client'

import { DAYS } from '@entities/common/consts'
import { DayType } from '@entities/common/type'
import { convertDayToLabel } from '@shared/lib/date/utils'

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
