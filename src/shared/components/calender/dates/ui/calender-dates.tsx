'use client'

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfToday,
  subDays,
} from 'date-fns'

import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'

interface CalendarDatesProps {
  currentMonth: Date
  startDate?: Date
  endDate?: Date
  onDateSelect: (date: Date) => void
}

const CalendarDates = ({ currentMonth, startDate, endDate, onDateSelect }: CalendarDatesProps) => {
  const today = startOfToday()
  const isPastMonth = isBefore(currentMonth, startOfMonth(today))

  const start = startOfMonth(currentMonth)
  const end = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start, end })
  const prefixDays = Array.from({ length: getDay(days[0]) }, (_, i) => subDays(days[0], getDay(days[0]) - i))
  const suffixDays = Array.from({ length: 42 - (prefixDays.length + days.length) }, (_, i) => addDays(end, i + 1))
  const allDays = [...prefixDays, ...days, ...suffixDays]

  const weeks: Date[][] = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7))
  }

  const availableWeek: Date[][] = weeks.filter(week => week.some(date => isSameMonth(date, currentMonth)))
  return (
    <Dates>
      {availableWeek.map((week, rowIndex) => (
        <DateRow key={rowIndex}>
          {week.map((date, i) => {
            const isCurrentMonth = isSameMonth(date, currentMonth)
            const isSelected =
              ((startDate && isSameDay(date, startDate)) || (endDate && isSameDay(date, endDate))) && isCurrentMonth
            const isInRange =
              startDate && endDate && isWithinInterval(date, { start: startDate, end: endDate }) && isCurrentMonth
            const isDisabled = !isCurrentMonth || isPastMonth || isBefore(date, today)

            return (
              <DateCell
                key={i}
                isCurrentMonth={isCurrentMonth}
                isSelected={!!isSelected}
                isInRange={!!isInRange}
                isDisabled={isDisabled}
                isSunday={getDay(date) === 0}
                isSaturday={getDay(date) === 6}
                onClick={() => !isDisabled && onDateSelect(date)}
              >
                {format(date, 'd')}
              </DateCell>
            )
          })}
        </DateRow>
      ))}
    </Dates>
  )
}

export default CalendarDates

const Dates = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const DateRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`

const DateCell = styled.div<{
  isCurrentMonth: boolean
  isSelected: boolean
  isInRange: boolean
  isDisabled: boolean
  isSunday: boolean
  isSaturday: boolean
}>`
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};

  color: ${({ isCurrentMonth, isSelected, isDisabled, isSunday, isSaturday }) => {
    if (!isCurrentMonth || isDisabled) return theme.colors.lfGray.base
    if (isSelected) return theme.colors.lfWhite.base
    if (isSaturday) return theme.colors.lfBlue.base
    if (isSunday) return theme.colors.lfRed.base
    return theme.colors.lfBlack.base
  }};

  background-color: ${({ isSelected, isInRange }) => {
    if (isSelected) return theme.colors.lfGreenMain.base
    if (isInRange) return theme.colors.lfGreenInactive.base
    return 'transparent'
  }};

  border-radius: ${theme.radius.base};
  ${({ isDisabled }) => (isDisabled ? 'pointer-events: none; opacity: 0.5;' : 'cursor: pointer;')};
`
