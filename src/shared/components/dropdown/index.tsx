'use client'

import { useRef, useState } from 'react'
import styled from '@emotion/styled'

import { useKeyClose } from '@shared/hooks/useKeyClose/useKeyClose'
import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
import { useToggle } from '@shared/hooks/useToggle/useToggle'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

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

const Dropdown = <OptionType,>({
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
    <Wrapper className={className}>
      <Label isFocused={isOpen || !!selected}>
        {label}
        {required && <RequiredMark>*</RequiredMark>}
      </Label>
      <SelectBox
        onClick={toggle}
        isFocused={isOpen}
        role='combobox'
        aria-expanded={isOpen}
        aria-required={required}
        tabIndex={0}
      >
        <SelectedText>{selected ? getOptionLabel(selected) : ''}</SelectedText>
        <IconWrapper isFocused={isOpen}>
          <LucideIcon name='ChevronDown' size={16} />
        </IconWrapper>
      </SelectBox>
      {isOpen && (
        <DropdownBox ref={dropdownRef} maxHeight={maxVisibleCount * 40}>
          {options.map((option, index) => (
            <Item
              key={getOptionKey(option)}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              isHovered={hoveredIndex === index}
            >
              {getOptionLabel(option)}
            </Item>
          ))}
        </DropdownBox>
      )}
    </Wrapper>
  )
}

export default Dropdown

// === Styles ===

const Wrapper = styled.div`
  width: 200px;
  position: relative;
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

const SelectBox = styled.div<{ isFocused: boolean }>`
  padding: 6px 8px;
  border: none;
  border-bottom: 2px solid ${theme.colors.lfLightGray.base};
  background: transparent;
  cursor: pointer;
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%) scaleX(${({ isFocused }) => (isFocused ? 1 : 0)});
    transform-origin: center;
    width: 100%;
    height: 2px;
    background-color: ${theme.colors.lfBlack.base};
    transition: transform 0.3s ease;
  }
`

const SelectedText = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
`

const IconWrapper = styled.div<{ isFocused: boolean }>`
  transform: rotate(${({ isFocused }) => (isFocused ? 180 : 0)}deg);
  transition: transform 0.3s ease;
`

const DropdownBox = styled.ul<{ maxHeight: number }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: ${({ maxHeight }) => maxHeight}px;
  overflow-y: auto;
  margin-top: 8px;
  padding: 8px 4px;
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfInput};
  background-color: ${theme.colors.lfWhite.base};
  z-index: 10;
  list-style: none;
`

const Item = styled.li<{ isHovered: boolean }>`
  padding: 10px 4px;
  text-align: center;
  font-size: ${theme.fontSize.xss};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.lfBlack.base};
  background-color: ${({ isHovered }) => (isHovered ? theme.colors.lfLightGray.base : 'transparent')};
  cursor: pointer;
  border-radius: ${theme.radius.sm};
  transition: background-color 0.2s ease;
`
