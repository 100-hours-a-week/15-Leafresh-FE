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

import * as S from './styles'

export interface CalendarDatesProps {
  currentMonth: Date
  startDate?: Date
  endDate?: Date
  onDateSelect: (date: Date) => void
}

export const CalendarDates = ({ currentMonth, startDate, endDate, onDateSelect }: CalendarDatesProps) => {
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
    <S.Dates>
      {availableWeek.map((week, rowIndex) => (
        <S.DateRow key={rowIndex}>
          {week.map((date, i) => {
            const isCurrentMonth = isSameMonth(date, currentMonth)
            const isSelected =
              ((startDate && isSameDay(date, startDate)) || (endDate && isSameDay(date, endDate))) && isCurrentMonth
            const isInRange =
              startDate && endDate && isWithinInterval(date, { start: startDate, end: endDate }) && isCurrentMonth
            const isDisabled = !isCurrentMonth || isPastMonth || isBefore(date, today)

            return (
              <S.DateCell
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
              </S.DateCell>
            )
          })}
        </S.DateRow>
      ))}
    </S.Dates>
  )
}
