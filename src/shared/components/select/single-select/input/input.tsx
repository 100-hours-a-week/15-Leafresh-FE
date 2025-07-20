'use client'
import { InjectedTriggerProps, LucideIcon } from '@/shared/components'

import * as S from './styles'

interface SelectInputProps<T> extends InjectedTriggerProps {
  label: string
  selected: T | undefined
  required?: boolean
}

export const SelectInput = <T extends string | number>({
  label,
  selected,
  required,

  isOpen = false,
  onClick,
}: SelectInputProps<T>) => {
  return (
    <S.InputWrapper>
      <S.Label isFocused={isOpen || !!selected}>
        {label}
        {required && <S.RequiredMark>*</S.RequiredMark>}
      </S.Label>

      <S.SelectBox onClick={onClick} isFocused={isOpen || !!selected}>
        {selected !== undefined && <S.SelectedText>{selected}</S.SelectedText>}
        <S.IconWrapper isFocused={isOpen}>
          <LucideIcon name='ChevronDown' size={16} />
        </S.IconWrapper>
      </S.SelectBox>
    </S.InputWrapper>
  )
}
