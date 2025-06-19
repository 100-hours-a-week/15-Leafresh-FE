'use client'

import styled from '@emotion/styled'

import { DAYS } from '@entities/challenge/constant'
import { DayType } from '@entities/challenge/type'
import { theme } from '@shared/config/style/theme'
import { convertDayToLabel } from '@shared/lib/date/utils'

interface CalendarWeekdaysProps {
  startDayOfWeek: DayType
}

export const CalendarWeekdays = ({ startDayOfWeek }: CalendarWeekdaysProps) => {
  const getOrderedDays = () => {
    const startIndex = DAYS.indexOf(startDayOfWeek)
    return [...DAYS.slice(startIndex), ...DAYS.slice(0, startIndex)]
  }

  return (
    <Weekdays>
      {getOrderedDays().map(day => (
        <Weekday key={day}>{convertDayToLabel(day)}</Weekday>
      ))}
    </Weekdays>
  )
}

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
`

const Weekday = styled.div`
  text-align: center;
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.lfBlack.base};
`
