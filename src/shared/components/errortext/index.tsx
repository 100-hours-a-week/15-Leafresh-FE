'use client'

import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'

interface ErrorTextProps {
  message?: string
  className?: string
}

const ErrorText = ({ message, className }: ErrorTextProps) => {
  if (!message) return null
  return <Text className={className}>{message}</Text>
}

export default ErrorText

const Text = styled.p`
  margin-top: 6px;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.lfRed.base};
  font-weight: ${theme.fontWeight.medium};
`
