'use client'

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfToday,
  subDays,
  subMonths,
} from 'date-fns'
import { ko } from 'date-fns/locale'

import { useState } from 'react'
import styled from '@emotion/styled'

import { DAYS } from '@entities/challenge/constant'
import { DayType } from '@entities/challenge/type'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/emotion/theme'

/**
 * selectedDate : 선택된 날짜를 표시 (배경색 처리 등)
 * onDateSelect : 날짜 클릭 시 호출되는 콜백
 * highlightToday : 오늘 날짜 표시 여부
 * startDayOfWeek : 일요일부터 시작할지, 월요일부터 시작할지
 * renderDateCell : 날짜 셀을 사용자 정의 렌더링 가능하게
 * minDate/maxDate : 선택 가능 범위 제한
 * onMonthChange : 좌우 화살표 클릭으로 월 이동 시 호출
 */
interface CalendarProps {
  selectedDate: Date /** 선택된 날짜 */
  onDateSelect: (date: Date) => void /** 날짜 선택시 동작하는 콜백 */
  startDayOfWeek?: DayType
  className?: string
}

const Calendar = ({ selectedDate, onDateSelect, startDayOfWeek = 'SUNDAY', className }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(selectedDate))

  const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))

  const getOrderedDays = () => {
    const startIndex = DAYS.indexOf(startDayOfWeek)
    return [...DAYS.slice(startIndex), ...DAYS.slice(0, startIndex)]
  }

  const renderDates = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })

    const prefixDays = Array.from({ length: getDay(days[0]) }, (_, i) => subDays(days[0], getDay(days[0]) - i))
    const suffixDays = Array.from({ length: 42 - (prefixDays.length + days.length) }, (_, i) => addDays(end, i + 1))

    const allDays = [...prefixDays, ...days, ...suffixDays]
    const today = startOfToday()

    // ⛳ 7일씩 잘라서 렌더링
    const weeks: Date[][] = []
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7))
    }

    return weeks.map((week, rowIndex) => {
      const isAllDisabled = week.every(date => !isSameMonth(date, currentMonth) || isBefore(date, today))

      if (isAllDisabled) return null

      return (
        <DateRow key={rowIndex}>
          {week.map((date, i) => {
            const isCurrentMonth = isSameMonth(date, currentMonth)
            const isSelected = isSameDay(date, selectedDate)
            const isDisabled = isBefore(date, today)

            const isSunday = getDay(date) === 0
            const isSaturday = getDay(date) === 6

            return (
              <DateCell
                key={i}
                isCurrentMonth={isCurrentMonth}
                isSelected={isSelected}
                isDisabled={isDisabled}
                isSunday={isSunday}
                isSaturday={isSaturday}
                onClick={() => !isDisabled && onDateSelect(date)}
              >
                {format(date, 'd')}
              </DateCell>
            )
          })}
        </DateRow>
      )
    })
  }
  return (
    <Wrapper className={className}>
      <Header>
        <ArrowButton onClick={handlePrevMonth}>
          <LucideIcon name='ChevronLeft' size={16} />
        </ArrowButton>
        <CurrentMonth>{format(currentMonth, 'yyyy년 M월', { locale: ko })}</CurrentMonth>
        <ArrowButton onClick={handleNextMonth}>
          <LucideIcon name='ChevronRight' size={16} />
        </ArrowButton>
      </Header>

      <Weekdays>
        {getOrderedDays().map(day => (
          <Weekday key={day}>{convertDayToLabel(day)}</Weekday>
        ))}
      </Weekdays>

      <Dates>{renderDates()}</Dates>
    </Wrapper>
  )
}

export default Calendar

// === Utils ===
const convertDayToLabel = (day: DayType) => {
  switch (day) {
    case 'SUNDAY':
      return '일'
    case 'MONDAY':
      return '월'
    case 'TUESDAY':
      return '화'
    case 'WEDNESDAY':
      return '수'
    case 'THURSDAY':
      return '목'
    case 'FRIDAY':
      return '금'
    case 'SATURDAY':
      return '토'
  }
}

// === Styles ===
const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: ${theme.radius.base};
  background-color: ${theme.colors.lfWhite.base};
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const CurrentMonth = styled.h3`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
`

const ArrowButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
`

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
`

const Weekday = styled.div`
  text-align: center;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.lfBlack.base};
`
const DateRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`
const Dates = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const DateCell = styled.div<{
  isCurrentMonth: boolean
  isSelected: boolean
  isDisabled: boolean
  isSunday: boolean
  isSaturday: boolean
}>`
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};

  color: ${({ isCurrentMonth, isSelected, isDisabled, isSunday, isSaturday }) => {
    if (!isCurrentMonth || isDisabled) return theme.colors.lfGray.base
    if (isSelected) return theme.colors.lfWhite.base
    if (isSaturday) return theme.colors.lfBlue.base
    if (isSunday) return theme.colors.lfRed.base
    return theme.colors.lfBlack.base
  }};

  background-color: ${({ isSelected }) => (isSelected ? theme.colors.lfGreenMain.base : 'transparent')};
  border-radius: ${theme.radius.base};

  ${({ isDisabled }) => (isDisabled ? 'pointer-events: none; opacity: 0.5;' : 'cursor: pointer;')};
`
