'use client'

import { format } from 'date-fns'

import { useState } from 'react'
import styled from '@emotion/styled'

import Calendar from '@shared/components/calender'
import { theme } from '@shared/styles/emotion/theme'

const CalendarTestPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <PageWrapper>
      <Title>선택된 날짜: {format(selectedDate, 'yyyy-MM-dd')}</Title>
      <StyledCalendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
    </PageWrapper>
  )
}

export default CalendarTestPage

// === Styles ===

const PageWrapper = styled.div`
  padding: 32px;
  background-color: ${theme.colors.lfInputBackground.base};
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: 24px;
`

const StyledCalendar = styled(Calendar)`
  width: 360px;
`
