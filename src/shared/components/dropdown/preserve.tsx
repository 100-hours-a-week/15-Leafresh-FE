'use client'

import { useRef, useState } from 'react'
import styled from '@emotion/styled'

import { useToggle } from '@shared/hooks/useToggle/useToggle'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/emotion/theme/theme'

interface DropdownProps {
  label: string
  options: string[]
  selected?: string
  onChange: (value: string) => void
  maxVisibleCount?: number
  className?: string
}

const Dropdown = ({ label, options, selected, onChange, maxVisibleCount = 4, className }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { value: isOpen, toggle: toggleIsOpen, setValue: setIsOpen } = useToggle()
  const [selectedValue, setSelectedValue] = useState<string>(selected || '')

  const isSelected: boolean = selectedValue !== ''
  const isFocused = isOpen || isSelected

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onChange(value)
    setIsOpen(false)
  }

  /** TODO: 닫힘 커스텀 훅 연동 */

  return (
    <Wrapper className={className} ref={dropdownRef}>
      <SelectBox onClick={toggleIsOpen} isSelected={isSelected}>
        <FloatingLabel isFocused={isFocused}>{label}</FloatingLabel>
        <SelectedText>{selectedValue || ''}</SelectedText>
        <Arrow name={isFocused ? 'ChevronDown' : 'ChevronUp'} />
      </SelectBox>
      {isOpen && (
        <OptionList maxHeight={maxVisibleCount * 40}>
          {/* 각 옵션 높이를 기준으로 max 높이 계산 */}
          {options.map((option, idx) => (
            <Option key={idx} onClick={() => handleSelect(option)} isActive={option === selectedValue}>
              {option}
            </Option>
          ))}
        </OptionList>
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

const SelectBox = styled.div<{ isSelected: boolean }>`
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px 12px 6px;
  border-bottom: 2px solid
    ${({ isSelected }) => (isSelected ? theme.colors.lfGreenBorder.base : theme.colors.lfGray.base)};
  cursor: pointer;
`

const FloatingLabel = styled.span<{ isFocused: boolean }>`
  position: absolute;
  top: ${({ isFocused }) => (isFocused ? '4px' : '50%')};
  left: 12px;
  font-size: ${({ isFocused }) => (isFocused ? theme.fontSize.xs : theme.fontSize.xs)};
  color: ${theme.colors.lfDarkGray.base};
  transform: translateY(-50%);
  transition: all 0.2s ease-in-out;
`

const SelectedText = styled.p`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
`

const Arrow = styled(LucideIcon)``

const OptionList = styled.ul<{ maxHeight: number }>`
  width: 100%;
  max-height: ${({ maxHeight }) => `${maxHeight}px`};
  padding: 6px;

  position: absolute;
  top: calc(100% + 6px);
  z-index: 10;

  background-color: ${theme.colors.lfWhite};
  border-radius: ${theme.radius.xs};
  box-shadow: ${theme.shadow.lfInput};

  color: ${theme.colors.lfBlack.base};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2px;
  overflow-y: auto;
  background: ${theme.colors.lfWhite.base};
`

const Option = styled.li<{ isActive: boolean }>`
  padding: 10px 0px;
  text-align: center;

  font-size: ${theme.fontSize.xss};

  border-radius: ${theme.radius.xss};
  background-color: ${({ isActive }) => (isActive ? theme.colors.lfLightGray.base : 'transparent')};

  cursor: pointer;
  &:hover {
    background-color: ${theme.colors.lfLightGray.base};
  }
`
