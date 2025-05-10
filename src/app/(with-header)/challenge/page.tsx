// src/app/page.tsx
'use client'

import { useState } from 'react'
import styled from '@emotion/styled'
import TimePicker from '@shared/components/timepicker/TimePicker'

<<<<<<< HEAD
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
=======
export default function Page() {
  const [start, setStart] = useState('00:00')
  const [end, setEnd] = useState('23:59')

  return (
    <Container>
      <TimePicker
        label='인증 가능 시간 *'
        startValue={start}
        endValue={end}
        onChangeStart={setStart}
        onChangeEnd={setEnd}
      />
      <>
        {start} ~ {end}
      </>
    </Container>
>>>>>>> 156bf195b3e8a15566479e3a778e12b25cde7b22
  )
}

const Container = styled.div`
  padding: 24px;
  color: black;
`
const Output = styled.div`
  margin-top: 16px;
  font-size: 14px;
`