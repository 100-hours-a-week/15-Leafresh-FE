// src/app/page.tsx
'use client'

import { useState } from 'react'
import styled from '@emotion/styled'
import TimePicker from '@shared/components/timepicker/TimePicker'

export default function Page() {
  const [start, setStart] = useState('00:00')
  const [end, setEnd] = useState('23:59')

  return (
    <Container>
      <TimePicker
        label="인증 가능 시간 *"
        startValue={start}
        endValue={end}
        onChangeStart={setStart}
        onChangeEnd={setEnd}
      />
      <>{start} ~ {end}</>
    </Container>
  )
}

const Container = styled.div`
  padding: 24px;
  color:black;
`
const Output = styled.div`
  margin-top: 16px;
  font-size: 14px;
`
