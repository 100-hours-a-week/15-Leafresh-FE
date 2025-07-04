'use client'

import { cloneElement, isValidElement, useRef } from 'react'
import { ReactElement, ReactNode } from 'react'

import styled from '@emotion/styled'

import { theme } from '@/shared/config'
import { useOutsideClick, useToggle } from '@/shared/hooks'

import { DropdownContext, useDropdownContext } from './dropdown-context'

interface DropdownProps<T> {
  children: ReactNode
  selected: T | undefined // 아직 선택되지 않은 경우 undefined
  onSelect: (value: T) => void
  label: string
}

export const Dropdown = <T,>({ children, selected, onSelect }: DropdownProps<T>) => {
  const { value: isOpen, toggle, setValue } = useToggle(false)

  // 외부 클릭시 닫기
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick(ref as React.RefObject<HTMLElement>, () => setValue(false))

  return (
    <DropdownContext.Provider
      value={{
        selected,
        onSelect,
        isOpen,
        toggle,
      }}
    >
      <Wrapper ref={ref}>{children}</Wrapper>
    </DropdownContext.Provider>
  )
}

interface TriggerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: ReactElement<any>
}

/**
 * 드롭다운 트리거 요소
 * @param as 드롭다운 트리거 컴포넌트
 */
const Trigger = ({ as }: TriggerProps) => {
  const { toggle } = useDropdownContext()

  if (!isValidElement(as)) return null

  const child = as as ReactElement<{ onClick?: (e: React.MouseEvent<HTMLElement>) => void }>

  return cloneElement(child, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      child.props.onClick?.(e)
      toggle()
    },
  })
}

/**
 * 열린 드롭다운의 영역
 */
const Menu = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useDropdownContext()
  if (!isOpen) return null

  return <MenuWrapper>{children}</MenuWrapper>
}

interface ItemProps<T> {
  value: T
  children: ReactNode
}

/**
 * 하나의 드롭다운
 */
const Item = <T,>({ value, children }: ItemProps<T>) => {
  const { onSelect, toggle } = useDropdownContext()

  const clickHandler = () => {
    onSelect(value)
    toggle()
  }

  return <ItemWrapper onClick={clickHandler}>{children}</ItemWrapper>
}

Dropdown.Trigger = Trigger
Dropdown.Menu = Menu
Dropdown.Item = Item

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

/* max-height: ${({ maxHeight }) => maxHeight}px; */
const MenuWrapper = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;

  overflow-y: auto;
  margin-top: 8px;
  padding: 8px 4px;
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfInput};
  background-color: ${theme.colors.lfWhite.base};
  z-index: 10;
  list-style: none;
`

const ItemWrapper = styled.li`
  padding: 12px 4px;
  text-align: center;
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.lfBlack.base};
  cursor: pointer;
  border-radius: ${theme.radius.sm};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.lfLightGray.base};
  }
`
