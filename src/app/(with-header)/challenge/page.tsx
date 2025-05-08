'use client'

import { useState } from 'react'
import styled from '@emotion/styled'

import DatePicker from '@shared/components/datepicker/DatePicker'
import LucideIcon from '@shared/lib/ui/LucideIcon'

const CalendarTestPage = () => {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  return (
    <Wrapper>
      <StyledDatePicker
        icon={<LucideIcon name='Calendar' size={24} strokeWidth={2.5} />}
        label='챌린지 기간 *'
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
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
