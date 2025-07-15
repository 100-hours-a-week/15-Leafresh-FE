'use client'
import * as S from './styles'

interface ErrorTextProps {
  message?: string
  className?: string
}

export const ErrorText = ({ message, className }: ErrorTextProps) => {
  if (!message) return null
  return <S.Text className={className}>{message}</S.Text>
}
