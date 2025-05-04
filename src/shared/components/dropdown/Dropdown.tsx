'use client'

import { useState } from 'react'
import styled from '@emotion/styled'

import { useToggle } from '@shared/hooks/useToggle/useToggle'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

interface DropdownProps {
  label: string
  options: string[]
  selected?: string
  onChange: (value: string) => void
  maxVisibleCount?: number // 디폴트는 4
  className?: string
}

const Dropdown = ({ label, options, selected, onChange, maxVisibleCount = 4, className }: DropdownProps) => {
  const { value: isOpen, toggle, setValue: setIsOpen } = useToggle(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = (value: string) => {
    onChange(value)
    setIsOpen(false)
  }

  return (
    <Wrapper className={className}>
      <Label isFocused={isOpen || !!selected}>{label}</Label>
      <SelectBox onClick={toggle} isFocused={isOpen}>
        <SelectedText>{selected || ''}</SelectedText>
        <IconWrapper isFocused={isOpen}>
          <LucideIcon name='ChevronDown' size={20} />
        </IconWrapper>
      </SelectBox>
      {isOpen && (
        <OptionBox maxHeight={maxVisibleCount * 40}>
          {options.map((option, index) => (
            <Option
              key={option}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              isHovered={hoveredIndex === index}
            >
              {option}
            </Option>
          ))}
        </OptionBox>
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
  /* transform: translateY(-50%); */

  font-size: ${({ isFocused }) => (isFocused ? theme.fontSize.xss : theme.fontSize.xs)};
  color: ${({ isFocused }) => (isFocused ? theme.colors.lfGreenBorder.base : theme.colors.lfDarkGray.base)};
  transition: all 0.2s ease;
  pointer-events: none;
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
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
`

const IconWrapper = styled.div<{ isFocused: boolean }>`
  transform: rotate(${({ isFocused }) => (isFocused ? 180 : 0)}deg);
  transition: transform 0.3s ease;
`

const OptionBox = styled.ul<{ maxHeight: number }>`
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

const Option = styled.li<{ isHovered: boolean }>`
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
