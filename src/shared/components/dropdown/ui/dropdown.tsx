'use client'

import { useRef, useState } from 'react'

import { useKeyClose } from '@shared/hooks/use-key-close/useKeyClose'
import { useOutsideClick } from '@shared/hooks/use-outside-click/useOutsideClick'
import { useToggle } from '@shared/hooks/use-toggle/useToggle'
import LucideIcon from '@shared/lib/ui/LucideIcon'

import * as S from './styles'

export interface DropdownProps<OptionType> {
  label: string
  getOptionLabel: (option: OptionType) => string

  options: OptionType[]
  getOptionKey: (option: OptionType) => string | number
  selected?: OptionType

  onChange: (value: OptionType) => void

  maxVisibleCount?: number
  className?: string
  required?: boolean
}

export const Dropdown = <OptionType,>({
  label,
  options,
  selected,
  onChange,
  getOptionLabel,
  getOptionKey,
  maxVisibleCount = 4,
  className,
  required,
}: DropdownProps<OptionType>) => {
  const { value: isOpen, toggle, setValue: setIsOpen } = useToggle(false)
  const dropdownRef = useRef<HTMLUListElement>(null)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = (value: OptionType) => {
    onChange(value)
    setIsOpen(false)
  }

  useOutsideClick(dropdownRef as React.RefObject<HTMLElement>, toggle)
  useKeyClose('Escape', dropdownRef as React.RefObject<HTMLElement>, toggle)

  return (
    <S.Wrapper className={className}>
      <S.Label isFocused={isOpen || !!selected}>
        {label}
        {required && <S.RequiredMark>*</S.RequiredMark>}
      </S.Label>
      <S.SelectBox
        onClick={toggle}
        isFocused={isOpen || !!selected}
        role='combobox'
        aria-expanded={isOpen}
        aria-required={required}
        tabIndex={0}
      >
        <S.SelectedText>{selected ? getOptionLabel(selected) : ''}</S.SelectedText>
        <S.IconWrapper isFocused={isOpen}>
          <LucideIcon name='ChevronDown' size={16} />
        </S.IconWrapper>
      </S.SelectBox>
      {isOpen && (
        <S.DropdownBox ref={dropdownRef} maxHeight={maxVisibleCount * 40}>
          {options.map((option, index) => (
            <S.Item
              key={getOptionKey(option)}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              isHovered={hoveredIndex === index}
            >
              {getOptionLabel(option)}
            </S.Item>
          ))}
        </S.DropdownBox>
      )}
    </S.Wrapper>
  )
}
