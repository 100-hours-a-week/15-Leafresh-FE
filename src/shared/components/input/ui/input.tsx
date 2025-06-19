'use client'

import { InputHTMLAttributes, useState } from 'react'
import styled from '@emotion/styled'

import { theme } from '@shared/config/style/theme'

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
    <Wrapper className={className}>
      <Label isFocused={isActive}>
        {label}
        {required && <RequiredMark>*</RequiredMark>}
      </Label>
      <StyledInput
        {...rest}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isFocused={isFocused}
        aria-required={required}
      />
      {/* input 요소는 input::before가 없어서 따로 만들어주어야 함 */}
      <Underline isFocused={isFocused || !!value} />
    </Wrapper>
  )
}

// === Styles ===
const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const Label = styled.label<{ isFocused: boolean }>`
  position: absolute;
  top: ${({ isFocused }) => (isFocused ? '-12px' : '50%')};
  transform: translateY(${({ isFocused }) => (isFocused ? '0' : '-50%')});

  font-size: ${({ isFocused }) => (isFocused ? theme.fontSize.xs : theme.fontSize.sm)};
  font-weight: ${theme.fontWeight.medium};

  color: ${theme.colors.lfBlack.base};
  transition: all 0.2s ease;
  pointer-events: none;
`

const RequiredMark = styled.span`
  color: ${theme.colors.lfGreenBorder.base};
  margin-left: 4px;
`

const StyledInput = styled.input<{ isFocused: boolean }>`
  width: 100%;
  padding: 6px 8px;
  border: none;
  border-bottom: 2px solid ${theme.colors.lfLightGray.base};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  background-color: transparent;
  color: ${theme.colors.lfBlack.base};
  outline: none;

  &::placeholder {
    color: transparent;
  }
`

const Underline = styled.div<{ isFocused: boolean }>`
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: ${theme.colors.lfBlack.base};
  transform: scaleX(${({ isFocused }) => (isFocused ? 1 : 0)});
  transform-origin: center;
  transition: transform 0.3s ease;
`
