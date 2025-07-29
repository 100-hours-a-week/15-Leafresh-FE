'use client'
import * as S from './styles'

interface ErrorTextProps {
  text?: string
  className?: string
}

export const ErrorText = ({ text, className }: ErrorTextProps) => {
  if (!text) return null
  return <S.Text className={className}>{text}</S.Text>
}
