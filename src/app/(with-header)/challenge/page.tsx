// src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import Chatbot from '@shared/components/chatbot/Chatbot'

const CalendarTestPage = () => {
  return (
    <Wrapper>
      <Chatbot />
    </Wrapper>
  )
}

export default CalendarTestPage
const Wrapper = styled.div`
  width: 100%;
`
