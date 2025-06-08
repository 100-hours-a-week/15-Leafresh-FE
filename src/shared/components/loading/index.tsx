/** @jsxImportSource @emotion/react */
'use client'

import { ReactNode } from 'react'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const Loading = (): ReactNode => {
  return (
    <Container>
      <DotWrapper>
        <Dot delay='0s' />
        <Dot delay='0.2s' />
        <Dot delay='0.4s' />
      </DotWrapper>
      <TextWrapper>
        <span>잠시만 기다려주세요</span>
      </TextWrapper>
    </Container>
  )
}

export default Loading
// 애니메이션 정의
const opacityFade = keyframes`
  0% { opacity: 1 }
  50% { opacity: 0 }
  100% { opacity: 1 }
`

// 스타일 정의
const Container = styled.div`
  margin: 24px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

const DotWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`

const Dot = styled.div<{ delay: string }>`
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background-color: ${({ theme }) => theme.colors.lfGray.base};
  animation: ${opacityFade} 1.5s infinite;
  animation-delay: ${({ delay }) => delay};
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`
