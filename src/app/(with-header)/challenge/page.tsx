'use client'

import { useEffect, useState } from 'react'
import styled from '@emotion/styled'

import DatePicker from '@shared/components/datepicker/DatePicker'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import Chatbot from '@shared/components/chatbot/Chatbot'

const CalendarTestPage = () => {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  useEffect(() => {
    console.log('startDate: ', startDate)
    console.log('endDate: ', endDate)
  }, [startDate, endDate])

  return (
    <Wrapper>
      <Chatbot />
    </Wrapper>
  )
}

export default CalendarTestPage

// === Styles ===

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`
