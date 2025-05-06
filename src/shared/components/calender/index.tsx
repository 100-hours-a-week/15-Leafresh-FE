// 'use client'

// import {
//   addDays,
//   addMonths,
//   eachDayOfInterval,
//   endOfMonth,
//   format,
//   getDay,
//   isBefore,
//   isSameDay,
//   isSameMonth,
//   isWithinInterval,
//   startOfMonth,
//   startOfToday,
//   subDays,
//   subMonths,
// } from 'date-fns'
// import { ko } from 'date-fns/locale'

// import { useRef, useState } from 'react'
// import styled from '@emotion/styled'

// import { DAYS } from '@entities/challenge/constant'
// import { DayType } from '@entities/challenge/type'
// import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
// import { convertDayToLabel } from '@shared/lib/date/utils'
// import LucideIcon from '@shared/lib/ui/LucideIcon'
// import { theme } from '@shared/styles/emotion/theme'

// interface CalendarProps {
//   startDate?: Date
//   endDate?: Date
//   onDateSelect: (date: Date) => void
//   startDayOfWeek?: DayType
//   toggle: () => void
//   className?: string
// }

// const Calendar = ({
//   startDate,
//   endDate,
//   onDateSelect,
//   startDayOfWeek = 'SUNDAY',
//   toggle,
//   className,
// }: CalendarProps) => {
//   const today = startOfToday()
//   const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(startDate ?? today))
//   const dropdownRef = useRef<HTMLDivElement>(null)

//   const handlePrevMonth = () => {
//     setCurrentMonth(prev => subMonths(prev, 1))
//   }
//   const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))

//   const getOrderedDays = () => {
//     const startIndex = DAYS.indexOf(startDayOfWeek)
//     return [...DAYS.slice(startIndex), ...DAYS.slice(0, startIndex)]
//   }

//   const renderDates = () => {
//     const start = startOfMonth(currentMonth)
//     const end = endOfMonth(currentMonth)
//     const days = eachDayOfInterval({ start, end })

//     const prefixDays = Array.from({ length: getDay(days[0]) }, (_, i) => subDays(days[0], getDay(days[0]) - i))
//     const suffixDays = Array.from({ length: 42 - (prefixDays.length + days.length) }, (_, i) => addDays(end, i + 1))

//     const allDays = [...prefixDays, ...days, ...suffixDays]
//     const isPastMonth = isBefore(currentMonth, startOfMonth(today))

//     const weeks: Date[][] = []
//     for (let i = 0; i < allDays.length; i += 7) {
//       weeks.push(allDays.slice(i, i + 7))
//     }

//     return weeks
//       .filter(week => week.some(date => isSameMonth(date, currentMonth)))
//       .map((week, rowIndex) => (
//         <DateRow key={rowIndex}>
//           {week.map((date, i) => {
//             const isCurrentMonth = isSameMonth(date, currentMonth)
//             const isSelected =
//               ((startDate && isSameDay(date, startDate)) || (endDate && isSameDay(date, endDate))) && isCurrentMonth

//             const isInRange =
//               startDate && endDate && isWithinInterval(date, { start: startDate, end: endDate }) && isCurrentMonth

//             // 👇 핵심 조건
//             const isDisabled = !isCurrentMonth || isPastMonth || isBefore(date, today)

//             return (
//               <DateCell
//                 key={i}
//                 isCurrentMonth={isCurrentMonth}
//                 isSelected={!!isSelected}
//                 isInRange={!!isInRange}
//                 isDisabled={isDisabled}
//                 isSunday={getDay(date) === 0}
//                 isSaturday={getDay(date) === 6}
//                 onClick={() => !isDisabled && onDateSelect(date)}
//               >
//                 {format(date, 'd')}
//               </DateCell>
//             )
//           })}
//         </DateRow>
//       ))
//   }

//   useOutsideClick(dropdownRef as React.RefObject<HTMLElement>, toggle)

//   return (
//     <Wrapper className={className} ref={dropdownRef}>
//       <Header>
//         <ArrowButton onClick={handlePrevMonth}>
//           <LucideIcon name='ChevronLeft' size={16} />
//         </ArrowButton>
//         <CurrentMonth>{format(currentMonth, 'yyyy년 M월', { locale: ko })}</CurrentMonth>
//         <ArrowButton onClick={handleNextMonth}>
//           <LucideIcon name='ChevronRight' size={16} />
//         </ArrowButton>
//       </Header>

//       <Weekdays>
//         {getOrderedDays().map(day => (
//           <Weekday key={day}>{convertDayToLabel(day)}</Weekday>
//         ))}
//       </Weekdays>

//       <Dates>{renderDates()}</Dates>
//     </Wrapper>
//   )
// }

// export default Calendar

// const Wrapper = styled.div`
//   width: 80%;
//   max-width: 280px;
//   min-width: 260px;
//   padding: 16px;
//   border-radius: ${theme.radius.base};
//   box-shadow: ${theme.shadow.lfInput};
//   background-color: ${theme.colors.lfWhite.base};
// `

// const Header = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 16px;
// `

// const CurrentMonth = styled.h3`
//   font-size: ${theme.fontSize.xs};
//   font-weight: ${theme.fontWeight.semiBold};
//   color: ${theme.colors.lfBlack.base};
// `

// const ArrowButton = styled.button`
//   background: none;
//   border: none;
//   padding: 4px;
//   cursor: pointer;
// `

// const Weekdays = styled.div`
//   display: grid;
//   grid-template-columns: repeat(7, 1fr);
//   margin-bottom: 8px;
// `

// const Weekday = styled.div`
//   text-align: center;
//   font-size: ${theme.fontSize.xs};
//   font-weight: ${theme.fontWeight.regular};
//   color: ${theme.colors.lfBlack.base};
// `

// const DateRow = styled.div`
//   display: grid;
//   grid-template-columns: repeat(7, 1fr);
//   gap: 2px;
// `

// const Dates = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 2px;
// `

// const DateCell = styled.div<{
//   isCurrentMonth: boolean
//   isSelected: boolean
//   isInRange: boolean
//   isDisabled: boolean
//   isSunday: boolean
//   isSaturday: boolean
// }>`
//   width: 100%;
//   aspect-ratio: 1;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   font-size: ${theme.fontSize.xs};
//   font-weight: ${theme.fontWeight.medium};

//   color: ${({ isCurrentMonth, isSelected, isDisabled, isSunday, isSaturday }) => {
//     if (!isCurrentMonth || isDisabled) return theme.colors.lfGray.base
//     if (isSelected) return theme.colors.lfWhite.base
//     if (isSaturday) return theme.colors.lfBlue.base
//     if (isSunday) return theme.colors.lfRed.base
//     return theme.colors.lfBlack.base
//   }};

//   background-color: ${({ isSelected, isInRange }) => {
//     if (isSelected) return theme.colors.lfGreenMain.base
//     if (isInRange) return theme.colors.lfGreenInactive.base
//     return 'transparent'
//   }};

//   border-radius: ${theme.radius.base};
//   ${({ isDisabled }) => (isDisabled ? 'pointer-events: none; opacity: 0.5;' : 'cursor: pointer;')};
// `

// 📁 /calendar/index.tsx
'use client'

import { addMonths, startOfMonth, startOfToday, subMonths } from 'date-fns'

import { useRef, useState } from 'react'
import styled from '@emotion/styled'

import { DayType } from '@entities/challenge/type'
import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
import { theme } from '@shared/styles/theme'

import CalendarDates from './calender-dates'
import CalendarHeader from './calender-header'
import CalendarWeekdays from './calender-weekdays'

interface CalendarProps {
  startDate?: Date
  endDate?: Date
  onDateSelect: (date: Date) => void
  startDayOfWeek?: DayType
  toggle: () => void
  className?: string
}

const Calendar = ({
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

export default Calendar

const Wrapper = styled.div`
  width: 80%;
  max-width: 280px;
  min-width: 260px;
  padding: 16px;
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfInput};
  background-color: ${theme.colors.lfWhite.base};
`
