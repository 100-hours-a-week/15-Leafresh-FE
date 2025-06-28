'use client'

import { InputHTMLAttributes, useState } from 'react'

import * as S from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  className?: string
  required?: boolean // 👉 명시적 required prop
}

export const Input = ({ label, className, value, onFocus, onBlur, required, ...rest }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const isActive = isFocused || !!value

  return (
    <S.Wrapper className={className}>
      <S.Label isFocused={isActive}>
        {label}
        {required && <S.RequiredMark>*</S.RequiredMark>}
      </S.Label>
      <S.StyledInput
        {...rest}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isFocused={isFocused}
        aria-required={required}
      />
      {/* input 요소는 input::before가 없어서 따로 만들어주어야 함 */}
      <S.Underline isFocused={isFocused || !!value} />
    </S.Wrapper>
  )
}
