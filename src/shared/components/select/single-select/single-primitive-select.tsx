'use client'

import { ReactNode, useState } from 'react'

import styled from '@emotion/styled'

import { Select } from '../select'

interface SingleSelectProps<T> {
  label: string

  options: T[]
  className?: string
}

/**
 * 원시자료형을 옵션으로 가지는 드롭다운 + 단일 요소 선택
 * 추후 확장해서 여러가지 Select를 만들고 싶은 경우, 여러 버전으로 만들어서 사용하면 된다
 */
export const SinglePrimitiveSelect = <T extends string | number>({
  label,
  options,
}: SingleSelectProps<T>): ReactNode => {
  const [selected, setSelected] = useState<T>()

  const handleSelect = (value: T) => {
    setSelected(value)
  }

  return (
    <Select<T>
      trigger={<SelectInput label={label} selected={selected} />}
      selected={selected}
      onSelect={handleSelect}
      options={options}
      renderOption={(option: T) => <SelectOption option={option} />}
    />
  )
}

interface SelectInputProps<T> {
  selected: T | undefined
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void

  label: string
  required?: boolean
}

const SelectInput = <T extends string | number>({ label, selected, onClick, required }: SelectInputProps<T>) => {
  return (
    <InputWrapper onClick={onClick}>
      <FloatingLabel isFloating={!!selected}>
        {label}
        {required && <RequiredMark>*</RequiredMark>}
      </FloatingLabel>
      {selected && <SelectedText>{selected}</SelectedText>}
    </InputWrapper>
  )
}

interface SelectOptionProps<T> {
  option: T
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void
}

export const SelectOption = <T extends string | number>({ option, onClick }: SelectOptionProps<T>) => {
  return <OptionWrapper onClick={onClick}>{option}</OptionWrapper>
}

const InputWrapper = styled.button`
  width: 100%;
  height: 60px;

  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.lfLightGray.base};
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  cursor: pointer;
  min-width: 120px;
`

const FloatingLabel = styled.label<{ isFloating: boolean }>`
  position: absolute;
  top: ${({ isFloating }) => (isFloating ? '-20px' : '50%')};
  left: ${({ isFloating }) => (isFloating ? '12px' : '50%')};
  transform: ${({ isFloating }) => (isFloating ? 'translate(0, 0)' : 'translate(-50%, -50%)')};
  font-size: ${({ isFloating, theme }) => (isFloating ? theme.fontSize.xs : theme.fontSize.sm)};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  transition: all 0.2s ease;
  pointer-events: none;
`

const SelectedText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.lfGreenBorder.base};
  margin-left: 4px;
`
const OptionWrapper = styled.li`
  padding: 12px 4px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfLightGray.base};
  }
`
