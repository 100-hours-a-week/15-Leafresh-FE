'use client'

import * as S from './styles'

interface SelectItemProps<T> {
  option: T
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void
}

export const SelectItem = <T extends string | number>({ option, onClick }: SelectItemProps<T>) => {
  return <S.OptionWrapper onClick={onClick}>{option}</S.OptionWrapper>
}
