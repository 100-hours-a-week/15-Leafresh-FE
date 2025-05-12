'use client'

import { ReactNode } from 'react'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import LucideIcon from '@shared/lib/ui/LucideIcon'

interface LoadingProps {
  size?: number
  className?: string
}

const Loading = ({ size = 30, className }: LoadingProps): ReactNode => {
  return <StyledIcon name='LoaderCircle' size={size} className={className} />
}

export default Loading

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const StyledIcon = styled(LucideIcon)`
  animation: ${spin} 1s linear infinite;
`
