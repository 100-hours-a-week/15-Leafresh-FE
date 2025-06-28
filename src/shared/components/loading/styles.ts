import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

// 애니메이션 정의
const opacityFade = keyframes`
  0% { opacity: 1 }
  50% { opacity: 0 }
  100% { opacity: 1 }
`

// 스타일 정의
export const Container = styled.div`
  margin: 24px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

export const DotWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`

export const Dot = styled.div<{ delay: string }>`
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background-color: ${({ theme }) => theme.colors.lfGray.base};
  animation: ${opacityFade} 1.5s infinite;
  animation-delay: ${({ delay }) => delay};
`

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`
