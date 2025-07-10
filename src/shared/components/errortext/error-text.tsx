'use client'

import styled from '@emotion/styled'

import { theme } from '@/shared/config'

interface ErrorTextProps {
  text?: string
  className?: string
}

export const ErrorText = ({ text, className }: ErrorTextProps) => {
  if (!text) return null
  return <Text className={className}>{text}</Text>
}

const Text = styled.p`
  margin-top: 6px;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.lfRed.base};
  font-weight: ${theme.fontWeight.medium};
`
