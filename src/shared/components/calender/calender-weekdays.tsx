'use client'

import { DAYS } from '@entities/challenge/model/consts'
import { DayType } from '@entities/challenge/model/type'
import { convertDayToLabel } from '@shared/lib/date/utils'
import { theme } from '@shared/styles/theme'

import styled from '@emotion/styled'

interface CalendarWeekdaysProps {
  startDayOfWeek: DayType
}

const CalendarWeekdays = ({ startDayOfWeek }: CalendarWeekdaysProps) => {
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

export default CalendarWeekdays

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
